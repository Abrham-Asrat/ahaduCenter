'use strict';

jest.mock('nodemailer', () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: 'test-message' });
  return { createTransport: jest.fn().mockReturnValue({ sendMail }), __sendMail: sendMail };
});

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');

process.env.JWT_SECRET = 'test-secret';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';

const app = require('../../app');
const User = mongoose.model('User');
const mailer = require('nodemailer');

let mongod;
let verificationToken;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { startupTimeout: 120000 },
    binary: { downloadDir: './.mongodb-binaries' },
  });
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod?.stop(true);
});

beforeEach(async () => {
  await User.deleteMany({});
  mailer.__sendMail.mockClear();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      aud: process.env.GOOGLE_CLIENT_ID,
      iss: 'https://accounts.google.com',
      email: 'member@example.com',
      email_verified: 'true',
      name: 'Member User',
    }),
  });
});

afterEach(() => {
  delete global.fetch;
});

const registerUser = async (email = 'member@example.com') =>
  request(app).post('/api/auth/register').send({ name: 'Member User', email });

describe('passwordless registration and email verification', () => {
  it('registers with only name and email and sends a verification link', async () => {
    const response = await registerUser();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ verificationRequired: true });
    expect(response.body.token).toBeUndefined();
    expect(response.body.user).toMatchObject({ name: 'Member User', email: 'member@example.com' });

    const user = await User.findOne({ email: 'member@example.com' }).lean();
    expect(user.emailVerified).toBe(false);
    expect(user.passwordHash).toBeNull();
    expect(user.verificationTokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(mailer.__sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'member@example.com',
      text: expect.stringContaining('/verify-email?token='),
    }));

    verificationToken = mailer.__sendMail.mock.calls[0][0].text.match(/token=([^\n]+)/)[1];
  });

  it('verifies a valid link once and rejects it when reused', async () => {
    await registerUser();
    verificationToken = mailer.__sendMail.mock.calls[0][0].text.match(/token=([^\n]+)/)[1];

    const verified = await request(app).get(`/api/auth/verify-email?token=${verificationToken}`);
    expect(verified.status).toBe(200);
    expect(verified.body.message).toMatch(/verified/i);

    const user = await User.findOne({ email: 'member@example.com' }).lean();
    expect(user.emailVerified).toBe(true);
    expect(user.verificationTokenHash).toBeNull();

    const reused = await request(app).get(`/api/auth/verify-email?token=${verificationToken}`);
    expect(reused.status).toBe(400);
  });

  it('resends a rotated token with a generic response', async () => {
    await registerUser();
    const firstHash = (await User.findOne({ email: 'member@example.com' }).lean()).verificationTokenHash;

    const response = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'member@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/if an account requires verification/i);
    const user = await User.findOne({ email: 'member@example.com' }).lean();
    expect(user.verificationTokenHash).not.toBe(firstHash);
  });
});

describe('Google login', () => {
  it('rejects a registered user until email verification is complete', async () => {
    await registerUser();

    const response = await request(app)
      .post('/api/auth/google')
      .send({ credential: 'google-credential' });

    expect(response.status).toBe(403);
    expect(response.body.code).toBe('EMAIL_NOT_VERIFIED');
  });

  it('returns a JWT and nested user after Google login', async () => {
    await User.create({ name: 'Member User', email: 'member@example.com', emailVerified: true });

    const response = await request(app)
      .post('/api/auth/google')
      .send({ credential: 'google-credential' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ email: 'member@example.com', role: 'user' });
  });

  it('allows password login only for admins', async () => {
    const passwordHash = await bcrypt.hash('admin-password', 10);
    await User.create({ name: 'Admin', email: 'admin@example.com', role: 'admin', passwordHash });

    const response = await request(app)
      .post('/api/auth/admin-login')
      .send({ email: 'admin@example.com', password: 'admin-password' });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('admin');
  });
});
