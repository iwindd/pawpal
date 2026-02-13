const { execSync } = require('child_process');
const fs = require('fs');

try {
  const result = execSync(
    'node node_modules/jest/bin/jest.js --testPathPattern=wallet.repository.spec --verbose --no-cache --forceExit --ci',
    {
      cwd: __dirname,
      timeout: 180000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );
  fs.writeFileSync('test_output.txt', result, 'utf8');
  console.log('DONE - check test_output.txt');
} catch (e) {
  const output = (e.stdout || '') + '\n---STDERR---\n' + (e.stderr || '');
  fs.writeFileSync('test_output.txt', output, 'utf8');
  console.log('DONE (with errors) - check test_output.txt');
  console.log('Exit code:', e.status);
}
