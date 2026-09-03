const { body } = require('express-validator');

/**
 * updateProfileRules
 *
 * Validation rules for PUT /api/users/me.
 *
 * Both fields are optional, but at least one must be present and
 * non-empty for the request to be valid (enforced by the custom `.custom`
 * check at the end of the chain).
 *
 * - name  : optional, 1–100 characters after trimming
 * - email : optional, valid email format (normalised to lowercase)
 *
 * Returns HTTP 422 (via validate middleware) when:
 *   - A provided name is empty or exceeds 100 characters
 *   - A provided email is not a valid email address
 *   - Neither field is present in the request body
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

  // At least one of the two fields must be provided
  body()
    .custom((_value, { req }) => {
      const { name, email } = req.body;
      const hasName  = name  !== undefined;
      const hasEmail = email !== undefined;

      if (!hasName && !hasEmail) {
        throw new Error(
          'At least one field (name or email) must be provided'
        );
      }
      return true;
    }),
];

module.exports = {
  updateProfileRules,
};
