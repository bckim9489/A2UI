import fs from "node:fs/promises";
import path from "node:path";

const SRC_DIR = path.resolve("../../specification/0.8/json");
const DEST_DIR = path.resolve("src/0.8/schemas");

async function main() {
  await fs.mkdir(DEST_DIR, { recursive: true });

  const entries = await fs.readdir(SRC_DIR, { withFileTypes: true });
  const jsonFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => e.name);

  if (jsonFiles.length === 0) {
    throw new Error(`No .json files found in: ${SRC_DIR}`);
  }

  await Promise.all(
    jsonFiles.map(async (name) => {
      const from = path.join(SRC_DIR, name);
      const to = path.join(DEST_DIR, name);
      await fs.copyFile(from, to);
    })
  );

  console.log(`Copied ${jsonFiles.length} schema file(s) to ${DEST_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
