const fs = require('fs');
const files = [
  'src/modules/order/order.service.ts',
  'src/modules/order/order.service.spec.ts',
  'src/modules/order/order.repository.ts',
  'src/modules/order/controllers/order.controller.ts',
  'src/modules/order/controllers/admin-order.controller.ts',
  'src/common/entities/order.entity.ts',
];
files.forEach((f) => {
  try {
    fs.unlinkSync(f);
    console.log(`Deleted ${f}`);
  } catch (e) {
    // console.error(e);
  }
});
try {
  fs.rmdirSync('src/modules/order/controllers');
} catch (e) {}
