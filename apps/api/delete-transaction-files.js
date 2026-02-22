const fs = require('fs');
const files = [
  'src/modules/transaction/transaction.service.ts',
  'src/modules/transaction/transaction.service.spec.ts',
  'src/modules/transaction/transaction.repository.ts',
  'src/modules/transaction/transaction.repository.spec.ts',
  'src/modules/transaction/admin-transaction.controller.ts',
  'src/common/entities/transaction.entity.ts',
];
files.forEach((f) => {
  try {
    fs.unlinkSync(f);
    console.log(`Deleted ${f}`);
  } catch (e) {}
});
