import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const edition = process.argv[2] ?? "free";
if (!["free", "premium"].includes(edition)) throw new Error("Choose either 'free' or 'premium'.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const folder = path.join(root, "dist", `regionwright-${edition}`);
const manifest = JSON.parse(await readFile(path.join(folder, "module.json"), "utf8"));
const packageName = edition === "free" ? "regionwright-puzzles-and-traps" : "regionwright-studio";
const archive = path.join(root, "dist", `${packageName}-v${manifest.version}.zip`);

await rm(archive, { force: true });
await execFileAsync("tar.exe", ["-a", "-c", "-f", archive, "-C", folder, "."]);
console.log(`${edition[0].toUpperCase()}${edition.slice(1)} release archive created at ${archive}`);
