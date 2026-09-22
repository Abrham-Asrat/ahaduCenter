'use strict';

/** Domain-friendly value generators without adding a faker dependency. */

const { randomInt, pick } = require('./random');

const FIRST_NAMES = ['Abel', 'Alemu', 'Betelhem', 'Dawit', 'Hana', 'Kebede', 'Liya', 'Mekdes', 'Nati', 'Ruth', 'Samuel', 'Selam'];
const LAST_NAMES = ['Abebe', 'Bekele', 'Demissie', 'Gebre', 'Hailu', 'Kassa', 'Lemma', 'Mamo', 'Tadesse', 'Tesfaye'];
const CITIES = ['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Mekelle'];

function name(index) {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)} ${index + 1}`;
}

function email(index) {
  return `member${String(index + 1).padStart(2, '0')}@ahadu.test`;
}

function isbn(index) {
  return `978-99944-${String(index + 1).padStart(5, '0')}-${randomInt(0, 9)}`;
}

function price(min = 300, max = 180000) {
  return Math.round((randomInt(min, max) + Math.random()) * 100) / 100;
}

function city() {
  return pick(CITIES);
}

module.exports = { name, email, isbn, price, city };
