const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ========================= CONFIG =========================
const SCHEMAS_ROOT = "packages/shared/src/schemas";
const INDEX_FILE = "packages/shared/src/index.ts";
// ==========================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getTypeName(name) {
  return name
    .split(".")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function createSchemaFile(name) {
  const parts = name.split(".");
  const folderPath = path.join(SCHEMAS_ROOT, ...parts.slice(0, -1));
  const fileName = parts[parts.length - 1] + ".ts";
  const filePath = path.join(folderPath, fileName);

  fs.mkdirSync(folderPath, { recursive: true });

  const typeName = getTypeName(name);
  const content = `import { z } from "zod";

export const ${typeName}Schema = z.object({
  // TODO: define fields
});

export type ${typeName}Input = z.infer<typeof ${typeName}Schema>;
`;

  fs.writeFileSync(filePath, content);
  console.log(`✅ Created ${filePath}`);

  return filePath;
}

function updateIndexFile(name) {
  const exportLine = `export * from './schemas/${name.split(".").join("/")}'\n`;

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
rl.question("Enter schema name (e.g., user.register): ", (name) => {
  createSchemaFile(name);
  updateIndexFile(name);
  rl.close();
});
