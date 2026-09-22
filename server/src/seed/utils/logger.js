'use strict';

/** Timestamped, colorized seed output kept dependency-free for CI logs. */

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'cyan') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color] || ''}[${timestamp}] ${message}${colors.reset}`);
}

function success(message) { log(message, 'green'); }
function warn(message) { log(message, 'yellow'); }
function error(message) { log(message, 'red'); }

module.exports = { log, success, warn, error };
