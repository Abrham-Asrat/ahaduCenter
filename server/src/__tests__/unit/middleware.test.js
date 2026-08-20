'use strict';

/**
 * Unit tests — Express middleware
 *
 * Covers:
 *   - authenticate   (middleware/authenticate.js)
 *   - requireRole    (middleware/requireRole.js)
 *   - validate       (middleware/validate.js)
 *   - errorHandler   (middleware/errorHandler.js)
 *   - CORS preflight (app.js + supertest)
 *
 * Middleware tests use plain Jest mock req/res/next objects.
 * CORS preflight uses supertest against the real Express app.
 */

// ── JWT secret must be set before requiring anything that imports jwt.js ──
process.env.JWT_SECRET = 'test-middleware-secret';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

// Mock express-validator at module scope so Jest hoisting works correctly.
// The mock is used by the `validate` describe block.
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const jwt = require('jsonwebtoken');

// ── helpers ───────────────────────────────────────────────────────────────

/**
 * Build a minimal Express-style req/res/next triple.
 * `res.json` records the last call in `res._body`.
 * `res.status` is chainable and records the status in `res._status`.
 */
function makeMocks(overrides = {}) {
  const res = {
    _status: null,
    _body: null,
    status(code) {
      this._status = code;
      return this;           // chainable: res.status(401).json({})
    },
    json(body) {
      this._body = body;
      return this;
    },
  };

  const req = { headers: {}, user: undefined, ...overrides };
  const next = jest.fn();

  return { req, res, next };
}

/** Sign a real token with the test secret */
function makeToken(payload, opts = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h', ...opts });
}

// ═══════════════════════════════════════════════════════════════════════════
// authenticate
// ═══════════════════════════════════════════════════════════════════════════

describe('authenticate middleware', () => {
  const authenticate = require('../../../middleware/authenticate');

  it('returns 401 when Authorization header is absent', () => {
    const { req, res, next } = makeMocks();

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with "Bearer "', () => {
    const { req, res, next } = makeMocks({
      headers: { authorization: 'Basic someBase64' },
    });

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for an invalid (garbage) token', () => {
    const { req, res, next } = makeMocks({
      headers: { authorization: 'Bearer not.a.real.jwt' },
    });

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for an expired token', () => {
    const expiredToken = jwt.sign(
      { id: 'u1', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: -1 }       // already expired
    );

    const { req, res, next } = makeMocks({
      headers: { authorization: `Bearer ${expiredToken}` },
    });

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for a token signed with a different secret', () => {
    const wrongToken = jwt.sign({ id: 'u1', role: 'user' }, 'wrong-secret');

    const { req, res, next } = makeMocks({
      headers: { authorization: `Bearer ${wrongToken}` },
    });

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and attaches req.user for a valid token', () => {
    const token = makeToken({ id: 'user-42', role: 'admin' });

    const { req, res, next } = makeMocks({
      headers: { authorization: `Bearer ${token}` },
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 'user-42', role: 'admin' });
    expect(res._status).toBeNull();   // no response sent
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// requireRole
// ═══════════════════════════════════════════════════════════════════════════

describe('requireRole middleware', () => {
  const requireRole = require('../../../middleware/requireRole');

  it('returns 403 when req.user is not set', () => {
    const { req, res, next } = makeMocks(); // no user attached

    requireRole('admin')(req, res, next);

    expect(res._status).toBe(403);
    expect(res._body).toMatchObject({ error: expect.stringContaining('Forbidden') });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when req.user.role does not match the required role', () => {
    const { req, res, next } = makeMocks({ user: { id: 'u1', role: 'user' } });

    requireRole('admin')(req, res, next);

    expect(res._status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when req.user.role is a different valid role', () => {
    const { req, res, next } = makeMocks({ user: { id: 'u1', role: 'librarian' } });

    requireRole('admin')(req, res, next);

    expect(res._status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when req.user.role matches the required role', () => {
    const { req, res, next } = makeMocks({ user: { id: 'u1', role: 'admin' } });

    requireRole('admin')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res._status).toBeNull();
  });

  it('calls next() for non-admin roles when they match', () => {
    const { req, res, next } = makeMocks({ user: { id: 'u2', role: 'librarian' } });

    requireRole('librarian')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// validate
// ═══════════════════════════════════════════════════════════════════════════

describe('validate middleware', () => {
  // `express-validator` is mocked at the top of this file (module scope).
  // Here we simply require the already-mocked version.
  const { validationResult } = require('express-validator');
  const validate = require('../../../middleware/validate');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls next() when there are no validation errors', () => {
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });

    const { req, res, next } = makeMocks();
    validate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res._status).toBeNull();
  });

  it('returns 422 with { errors: [{ field, message }] } when errors exist', () => {
    const fakeErrors = [
      { path: 'email', msg: 'Invalid email' },
      { path: 'password', msg: 'Password too short' },
    ];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => fakeErrors,
    });

    const { req, res, next } = makeMocks();
    validate(req, res, next);

    expect(res._status).toBe(422);
    expect(res._body).toEqual({
      errors: [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password too short' },
      ],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('falls back to err.param when err.path is undefined (older express-validator)', () => {
    const fakeErrors = [
      { param: 'title', msg: 'Title is required' }, // no `path` key
    ];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => fakeErrors,
    });

    const { req, res, next } = makeMocks();
    validate(req, res, next);

    expect(res._status).toBe(422);
    expect(res._body.errors[0]).toEqual({ field: 'title', message: 'Title is required' });
  });

  it('does not call next() when validation fails', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: 'name', msg: 'Required' }],
    });

    const { req, res, next } = makeMocks();
    validate(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// errorHandler
// ═══════════════════════════════════════════════════════════════════════════

describe('errorHandler middleware', () => {
  const errorHandler = require('../../../middleware/errorHandler');

  // Suppress console.error output during tests
  beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterAll(() => console.error.mockRestore());

  /** Build a minimal res mock for 4-argument error handler */
  function makeErrorRes() {
    const res = {
      _status: null,
      _body: null,
      status(code) { this._status = code; return this; },
      json(body) { this._body = body; return this; },
    };
    return res;
  }

  it('returns 500 for a generic error', () => {
    const err = new Error('Something went wrong');
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res._status).toBe(500);
    expect(res._body).toEqual({ error: 'Internal server error' });
  });

  it('does NOT expose the stack trace in 500 responses', () => {
    const err = new Error('Oops');
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    const bodyStr = JSON.stringify(res._body);
    expect(bodyStr).not.toContain('stack');
    expect(bodyStr).not.toContain('Error:');
    expect(bodyStr).not.toContain('at ');   // stack frame line
  });

  it('returns 400 for a Mongoose CastError', () => {
    const err = { name: 'CastError', path: '_id', value: 'bad-id' };
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res._status).toBe(400);
    expect(res._body.error).toContain('_id');
  });

  it('returns 409 for a MongoDB duplicate key error (code 11000)', () => {
    const err = { code: 11000, keyValue: { email: 'duplicate@example.com' } };
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res._status).toBe(409);
    expect(res._body.error).toContain('email');
  });

  it('returns 409 even when keyValue is absent', () => {
    const err = { code: 11000 };
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res._status).toBe(409);
  });

  it('returns 422 for a Mongoose ValidationError', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        title: { path: 'title', message: 'Path `title` is required.' },
        price: { path: 'price', message: 'Path `price` must be positive.' },
      },
    };
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res._status).toBe(422);
    expect(res._body.error).toBe('Validation failed');
    expect(Array.isArray(res._body.errors)).toBe(true);
    expect(res._body.errors).toEqual(
      expect.arrayContaining([
        { field: 'title', message: 'Path `title` is required.' },
        { field: 'price', message: 'Path `price` must be positive.' },
      ])
    );
  });

  it('returns 422 without exposing stack for ValidationError', () => {
    const err = {
      name: 'ValidationError',
      errors: { name: { path: 'name', message: 'Required.' } },
    };
    const res = makeErrorRes();

    errorHandler(err, {}, res, jest.fn());

    const bodyStr = JSON.stringify(res._body);
    expect(bodyStr).not.toContain('stack');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CORS preflight — OPTIONS from CLIENT_ORIGIN → 204 + correct headers
// ═══════════════════════════════════════════════════════════════════════════

describe('CORS preflight', () => {
  let request;
  let app;

  beforeAll(() => {
    // Ensure the env var is set before requiring the app
    process.env.CLIENT_ORIGIN = 'http://localhost:5173';

    // Restore the real express-validator BEFORE resetting modules,
    // otherwise app.js will try to use the mocked version (which has no
    // real `body`, `query`, etc.) and throw "body is not a function".
    jest.unmock('express-validator');

    // Purge cached modules so process.env changes take effect
    jest.resetModules();

    // Re-require after resetting modules
    // Path from src/__tests__/unit/ up to src/app.js is ../../app
    request = require('supertest');
    app = require('../../app');
  });

  it('OPTIONS from CLIENT_ORIGIN returns 204 with CORS headers', async () => {
    const res = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

    expect(res.status).toBe(204);

    // Origin should be reflected
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');

    // Common CORS headers should be present
    expect(res.headers['access-control-allow-methods']).toBeDefined();
    expect(res.headers['access-control-allow-headers']).toBeDefined();
  });

  it('OPTIONS from an unknown origin is rejected (no ACAO header)', async () => {
    const res = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'http://evil.com')
      .set('Access-Control-Request-Method', 'POST');

    // The CORS middleware should NOT reflect the unknown origin
    expect(res.headers['access-control-allow-origin']).not.toBe('http://evil.com');
  });
});
