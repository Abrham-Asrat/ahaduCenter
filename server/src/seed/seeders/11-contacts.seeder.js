'use strict';

/** Seeds realistic contact submissions for the admin inbox. */

const ContactSubmission = require('../../models/ContactSubmission');
const { name, email } = require('../utils/fakerHelpers');
const { randomDateWithin, pick } = require('../utils/random');

async function seedContacts(ctx) {
  const subjects = ['Library membership', 'Book availability', 'Pickup hours', 'Movie suggestion', 'Partnership inquiry'];
  const records = Array.from({ length: ctx.counts.contacts }, (_, index) => ({
    name: name(index), email: `contact${index + 1}@ahadu.test`, subject: pick(subjects),
    message: 'Please share more information about the Ahadu Center service and its available collections.',
    createdAt: randomDateWithin(90), updatedAt: new Date(),
  }));
  const contacts = await ContactSubmission.create(records);
  ctx.contacts = contacts;
  return contacts;
}

module.exports = seedContacts;
