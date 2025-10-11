const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ========================= CONFIG =========================
const TYPES_ROOT = "packages/shared/src/types";
const INDEX_FILE = "packages/shared/src/index.ts";
// ==========================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createTypeFile(name) {
  const parts = name.split(".");
  const folderPath = path.join(TYPES_ROOT, ...parts.slice(0, -1));
  const fileName = parts[parts.length - 1] + ".ts";
  const filePath = path.join(folderPath, fileName);

  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(filePath, "");
  console.log(`✅ Created ${filePath}`);

  return filePath;
}

function updateIndexFile(name) {
  const exportLine = `export * from './types/${name.split(".").join("/")}'\n`;

  let indexContent = "";
  if (fs.existsSync(INDEX_FILE)) {
    indexContent = fs.readFileSync(INDEX_FILE, "utf-8");
  }

  if (!indexContent.includes(exportLine)) {
    fs.appendFileSync(INDEX_FILE, exportLine);
    console.log(`✅ Updated ${INDEX_FILE}`);
  } else {
    console.log(`ℹ️  Export already exists in ${INDEX_FILE}`);
  }
}

// ========================= RUN =========================
rl.question("Enter type name (e.g., response.user): ", (name) => {
  createTypeFile(name);
  updateIndexFile(name);
  rl.close();
});
