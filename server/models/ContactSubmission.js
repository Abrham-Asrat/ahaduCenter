const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSubmissionSchema = new Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('ContactSubmission', ContactSubmissionSchema);
