import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validate } from './validation';

// ─── Unit Tests (example-based) ───────────────────────────────────────────────

describe('validate — unit tests', () => {
  it('returns an error when username is empty', () => {
    const result = validate('', 'validpassword');
    expect(result.valid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });

  it('returns an error when password is empty', () => {
    const result = validate('validuser', '');
    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  it('returns errors for both fields when both are empty', () => {
    const result = validate('', '');
    expect(result.valid).toBe(false);
    expect(result.errors.username).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  it('returns an error when username is too short (1 char)', () => {
    const result = validate('a', 'validpassword');
    expect(result.valid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });

  it('returns an error when username is too short (2 chars)', () => {
    const result = validate('ab', 'validpassword');
    expect(result.valid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });

  it('returns an error when password is too short (5 chars)', () => {
    const result = validate('validuser', 'short');
    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  it('returns an error when password is too short (1 char)', () => {
    const result = validate('validuser', 'x');
    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  it('passes with valid username (≥3 chars) and valid password (≥6 chars)', () => {
    const result = validate('alice', 'secret123');
    expect(result.valid).toBe(true);
    expect(result.errors.username).toBeUndefined();
    expect(result.errors.password).toBeUndefined();
  });

  it('passes with username exactly 3 chars and password exactly 6 chars', () => {
    const result = validate('abc', 'abcdef');
    expect(result.valid).toBe(true);
    expect(result.errors.username).toBeUndefined();
    expect(result.errors.password).toBeUndefined();
  });

  it('empty-field error takes priority over length error for username', () => {
    const result = validate('', 'validpassword');
    expect(result.errors.username).toBe('Username is required');
  });

  it('empty-field error takes priority over length error for password', () => {
    const result = validate('validuser', '');
    expect(result.errors.password).toBe('Password is required');
  });
});

// ─── Property-Based Tests ──────────────────────────────────────────────────────

describe('validate — property-based tests', () => {
  // Feature: login-ui, Property 1: Empty username always produces a validation error
  it('Property 1: empty username always errors regardless of password', () => {
    fc.assert(
      fc.property(fc.string(), (password) => {
        const result = validate('', password);
        return result.valid === false && result.errors.username !== undefined;
      }),
      { numRuns: 100 }
    );
  });

  // Feature: login-ui, Property 2: Empty password always produces a validation error
  it('Property 2: empty password always errors regardless of username', () => {
    fc.assert(
      fc.property(fc.string(), (username) => {
        const result = validate(username, '');
        return result.valid === false && result.errors.password !== undefined;
      }),
      { numRuns: 100 }
    );
  });

  // Feature: login-ui, Property 3: Short username always produces a validation error
  it('Property 3: username with length 1 or 2 always errors', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 2 }),
        fc.string(),
        (username, password) => {
          const result = validate(username, password);
          return result.valid === false && result.errors.username !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: login-ui, Property 4: Short password always produces a validation error
  it('Property 4: password with length 1–5 always errors', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string({ minLength: 1, maxLength: 5 }),
        (username, password) => {
          const result = validate(username, password);
          return result.valid === false && result.errors.password !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: login-ui, Property 5: Valid inputs always produce no errors
  it('Property 5: username ≥3 chars and password ≥6 chars always passes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3 }),
        fc.string({ minLength: 6 }),
        (username, password) => {
          const result = validate(username, password);
          return (
            result.valid === true &&
            result.errors.username === undefined &&
            result.errors.password === undefined
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
