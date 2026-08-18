const { body } = require('express-validator');

/**
 * updateProfileRules
 *
 * Validation rules for PUT /api/users/me.
 *
 * All three fields are optional, but at least one must be present and
 * non-empty for the request to be valid (enforced by the custom `.custom`
 * check at the end of the chain).
 *
 * - name  : optional, 1–100 characters after trimming
 * - email : optional, valid email format (normalised to lowercase)
 * - phone : optional, trimmed (no format constraint beyond trimming)
 *
 * Returns HTTP 422 (via validate middleware) when:
 *   - A provided name is empty or exceeds 100 characters
 *   - A provided email is not a valid email address
 *   - None of the three fields is present in the request body
 */
const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('name must be between 1 and 100 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('email must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),

  // At least one of the three fields must be provided
  body()
    .custom((_value, { req }) => {
      const { name, email, phone } = req.body;
      const hasName  = name  !== undefined;
      const hasEmail = email !== undefined;
      const hasPhone = phone !== undefined;

      if (!hasName && !hasEmail && !hasPhone) {
        throw new Error(
          'At least one field (name, email, or phone) must be provided'
        );
      }
      return true;
    }),
];

module.exports = {
  updateProfileRules,
};
