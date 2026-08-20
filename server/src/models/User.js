const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true, maxlength: 100 },
    email:       { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash:{ type: String, required: true },
    phone:       { type: String, trim: true, default: null },
    avatarUrl:   { type: String, default: null },
    role:        { type: String, enum: ['user', 'admin'], default: 'user' },
    resetToken:          { type: String, default: null },
    resetTokenExpiresAt: { type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
