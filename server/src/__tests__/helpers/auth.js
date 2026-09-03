'use strict';

async function registerAndLoginWithGoogle({ request, User, sendMail, email, name, alreadyRegistered = false }) {
  if (!alreadyRegistered) {
    const registration = await request
      .post('/api/auth/register')
      .send({ name, email });

    if (registration.status !== 201) {
      throw new Error(`Register failed with ${registration.status}: ${JSON.stringify(registration.body)}`);
    }
  }

  const mailCall = sendMail.mock.calls.at(-1)?.[0];
  const token = mailCall?.text?.match(/verify-email\?token=([^\n]+)/)?.[1];
  if (!token) throw new Error('Verification token was not included in the test email');

  const verification = await request.get(`/api/auth/verify-email?token=${token}`);
  if (verification.status !== 200) {
    throw new Error(`Verification failed with ${verification.status}: ${JSON.stringify(verification.body)}`);
  }

  process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-client-id';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      aud: process.env.GOOGLE_CLIENT_ID,
      iss: 'https://accounts.google.com',
      email,
      email_verified: true,
      name,
    }),
  });

  const login = await request
    .post('/api/auth/google')
    .send({ credential: 'test-google-credential' });

  if (login.status !== 200) {
    throw new Error(`Google login failed with ${login.status}: ${JSON.stringify(login.body)}`);
  }

  return login.body.token;
}

module.exports = { registerAndLoginWithGoogle };
