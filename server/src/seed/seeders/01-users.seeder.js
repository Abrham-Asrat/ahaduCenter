'use strict';

/** Seeds verified admin/demo accounts and ordinary users. */

const User = require('../../models/User');
const { hashPassword } = require('../utils/hash');
const { name, email, city } = require('../utils/fakerHelpers');
const { randomDateWithin } = require('../utils/random');

async function seedUsers(ctx) {
  const count = ctx.counts.users;
  if (count === 0) return [];

  const records = [];
  const adminPasswordHash = await hashPassword('Admin@123');
  records.push({
    name: 'Ahadu Center Administrator', email: 'admin@ahadu.test', passwordHash: adminPasswordHash,
    role: 'admin', emailVerified: true, emailVerifiedAt: randomDateWithin(180), createdAt: randomDateWithin(180), updatedAt: new Date(),
  });

  if (count > 1) {
    records.push({
      name: 'Ahadu Demo User', email: 'demo@ahadu.test', passwordHash: await hashPassword('Demo@123'),
      role: 'user', emailVerified: true, emailVerifiedAt: randomDateWithin(180), createdAt: randomDateWithin(180), updatedAt: new Date(),
    });
  }

  for (let index = records.length; index < count; index += 1) {
    records.push({
      name: name(index), email: email(index), passwordHash: await hashPassword(`Member@${100 + index}`),
      role: 'user', emailVerified: true, emailVerifiedAt: randomDateWithin(180), createdAt: randomDateWithin(180), updatedAt: new Date(),
    });
  }

  const users = await User.create(records);
  ctx.users = users;
  return users;
}

module.exports = seedUsers;
