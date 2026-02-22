const { exec } = require('child_process');
const fs = require('fs');
exec('npx tsc --noEmit', (error, stdout, stderr) => {
  fs.writeFileSync(
    'compile_output.txt',
    stdout + '\n' + stderr + '\n' + (error ? 'FAILED' : 'SUCCESS'),
  );
});
