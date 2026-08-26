import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
  const out = execSync('npm test', {
    cwd: 'D:\\Real-project\\AhaduCenter\\client',
    timeout: 120000,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  writeFileSync('D:\\Real-project\\AhaduCenter\\client-test-output.txt', out);
  console.log('Client tests done. Output written.');
} catch (err) {
  const combined = (err.stdout || '') + '\n' + (err.stderr || '');
  writeFileSync('D:\\Real-project\\AhaduCenter\\client-test-output.txt', combined);
  console.log('Client tests finished (with failures). Output written.');
}
