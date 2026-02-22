const fs = require('fs');
const files = [
  'src/modules/wallet/wallet.repository.ts',
  'src/modules/wallet/wallet.repository.spec.ts',
  'src/common/entities/wallet.entity.ts',
  'src/common/collections/wallet.collection.ts',
];
files.forEach((f) => {
  try {
    fs.unlinkSync(f);
    console.log(`Deleted ${f}`);
  } catch (e) {}
});
