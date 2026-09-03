const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true, maxlength: 100 },
    email:       { type: String, required: true, unique: true, trim: true, lowercase: true },
    role:        { type: String, enum: ['user', 'admin'], default: 'user' },
    emailVerified:         { type: Boolean, default: true },
    emailVerifiedAt:       { type: Date, default: null },
    verificationTokenHash:  { type: String, default: null },
    verificationTokenExpiresAt: { type: Date, default: null },
    resetToken:          { type: String, default: null },
    resetTokenExpiresAt: { type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = model('User', UserSchema);
