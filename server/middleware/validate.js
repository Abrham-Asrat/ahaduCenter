const { validationResult } = require('express-validator');

/**
 * Validate middleware.
 * Runs `validationResult(req)` after express-validator chains.
 * If there are validation errors, responds with HTTP 422 and a structured body:
 *   { errors: [{ field: string, message: string }] }
 *
 * Usage: router.post('/path', [...validatorRules], validate, controller)
 */
const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path ?? err.param,
      message: err.msg,
    }));
    return res.status(422).json({ errors });
  }

  next();
};

module.exports = validate;
