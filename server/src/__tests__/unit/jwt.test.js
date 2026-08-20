'use strict';

/**
 * Unit tests — JWT helper (utils/jwt.js)
 *
 * Tests sign/verify round-trip and expired-token behaviour.
 * JWT_SECRET is set before the module is required so that the module
 * picks up the test secret rather than whatever is in the environment.
 */

// Set the secret BEFORE requiring the module so it is baked in at require-time.
process.env.JWT_SECRET = 'test-jwt-secret-unit';

const jwt = require('jsonwebtoken');
const { sign, verify } = require('../../../utils/jwt');

describe('JWT helpers — sign / verify', () => {
  // ── Happy path ───────────────────────────────────────────────────────────

  it('sign returns a string', () => {
    const token = sign({ id: 'abc', role: 'user' });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // header.payload.signature
  });

  it('verify returns the original payload after sign', () => {
    const payload = { id: 'user-123', role: 'admin' };
    const token = sign(payload);
    const decoded = verify(token);

    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
  });

  it('round-trip preserves arbitrary extra fields in the payload', () => {
    const payload = { id: 'u1', role: 'user', email: 'a@b.com', extra: 42 };
    const token = sign(payload);
    const decoded = verify(token);

    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.extra).toBe(payload.extra);
  });

  it('token has an exp claim 24 h in the future (±10 s tolerance)', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = sign({ id: 'u1', role: 'user' });
    const after = Math.floor(Date.now() / 1000);

    const decoded = jwt.decode(token);
    const expectedExp = before + 24 * 60 * 60;

    // Allow ±10 seconds for test execution time
    expect(decoded.exp).toBeGreaterThanOrEqual(expectedExp - 10);
    expect(decoded.exp).toBeLessThanOrEqual(after + 24 * 60 * 60 + 10);
  });

  // ── Failure paths ────────────────────────────────────────────────────────

  it('verify throws on a tampered token', () => {
    const token = sign({ id: 'u1', role: 'user' });
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(() => verify(tampered)).toThrow();
  });

  it('verify throws on a token signed with a different secret', () => {
    const foreignToken = jwt.sign({ id: 'u2', role: 'user' }, 'different-secret');
    expect(() => verify(foreignToken)).toThrow();
  });

  it('verify throws on a malformed / random string', () => {
    expect(() => verify('not.a.jwt')).toThrow();
    expect(() => verify('')).toThrow();
  });

  it('verify throws with a TokenExpiredError for an expired token', () => {
    // Sign a token that expired 1 second ago
    const expiredToken = jwt.sign(
      { id: 'u3', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: -1 }       // negative expiresIn → already expired
    );

    let caught;
    try {
      verify(expiredToken);
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeDefined();
    expect(caught.name).toBe('TokenExpiredError');
  });
});
