const fs = require('fs');
try {
  fs.unlinkSync('src/modules/topup/topup.controller.ts');
  console.log('Deleted old topup.controller.ts');
  fs.unlinkSync('src/modules/topup/topup.service.ts');
  console.log('Deleted legacy topup.service.ts');
  fs.unlinkSync('src/modules/topup/topup.service.spec.ts');
  console.log('Deleted legacy topup.service.spec.ts');
} catch (e) {
  console.error(e);
}
