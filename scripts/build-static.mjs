import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("prototype");
const target = resolve("dist");

if (!existsSync(source)) {
  throw new Error("Folder prototype tidak ditemukan.");
}

rmSync(target, { force: true, recursive: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });

console.log("Build static selesai: dist/");
