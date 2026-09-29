#!/usr/bin/env node

/**
 * Translation Validation Script
 * 
 * Validates that en.json and am.json have identical key structures.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALE_DIR = join(__dirname, '../src/i18n/locales');
const EN_PATH = join(LOCALE_DIR, 'en.json');
const AM_PATH = join(LOCALE_DIR, 'am.json');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function validateTranslations() {
  log(colors.cyan, '\n🌐 Validating Translation Files...\n');

  if (!existsSync(EN_PATH)) {
    log(colors.red, '❌ Error: en.json not found');
    process.exit(1);
  }

  if (!existsSync(AM_PATH)) {
    log(colors.red, '❌ Error: am.json not found');
    process.exit(1);
  }

  let enTranslations, amTranslations;
  
  try {
    enTranslations = JSON.parse(readFileSync(EN_PATH, 'utf-8'));
    log(colors.green, '✓ Loaded en.json');
  } catch (error) {
    log(colors.red, '❌ Error parsing en.json:', error.message);
    process.exit(1);
  }

  try {
    amTranslations = JSON.parse(readFileSync(AM_PATH, 'utf-8'));
    log(colors.green, '✓ Loaded am.json');
  } catch (error) {
    log(colors.red, '❌ Error parsing am.json:', error.message);
    process.exit(1);
  }

  const enKeys = new Set(getAllKeys(enTranslations));
  const amKeys = new Set(getAllKeys(amTranslations));

  log(colors.blue, `\n📊 Statistics:`);
  log(colors.blue, `   English keys: ${enKeys.size}`);
  log(colors.blue, `   Amharic keys: ${amKeys.size}`);

  const missingInAm = [...enKeys].filter(key => !amKeys.has(key));
  const extraInAm = [...amKeys].filter(key => !enKeys.has(key));

  if (missingInAm.length === 0 && extraInAm.length === 0) {
    log(colors.green, '\n✅ SUCCESS: Translation files have identical key structures!');
    log(colors.green, `   Total keys: ${enKeys.size}`);
    process.exit(0);
  }

  let hasErrors = false;

  if (missingInAm.length > 0) {
    hasErrors = true;
    log(colors.red, `\n❌ Missing in am.json (${missingInAm.length} keys):`);
    missingInAm.slice(0, 10).forEach(key => log(colors.yellow, `   - ${key}`));
    if (missingInAm.length > 10) log(colors.yellow, `   ... and ${missingInAm.length - 10} more`);
  }

  if (extraInAm.length > 0) {
    hasErrors = true;
    log(colors.red, `\n❌ Extra in am.json (${extraInAm.length} keys):`);
    extraInAm.slice(0, 10).forEach(key => log(colors.yellow, `   - ${key}`));
    if (extraInAm.length > 10) log(colors.yellow, `   ... and ${extraInAm.length - 10} more`);
  }

  if (hasErrors) {
    log(colors.red, '\n❌ FAILED: Translation files have mismatched keys');
    process.exit(1);
  }
}

validateTranslations();
