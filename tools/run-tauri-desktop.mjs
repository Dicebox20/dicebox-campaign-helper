import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const appRoot = resolve(root, "apps", "campaign-helper-desktop");
const tauriEntry = resolve(root, "node_modules", "@tauri-apps", "cli", "tauri.js");
const mode = process.argv[2] ?? "build";
const args = mode === "build"
  ? [tauriEntry, "build", "--debug", "--no-bundle"]
  : mode === "dev"
    ? [tauriEntry, "dev"]
    : null;

if (!args) throw new Error(`Unknown Tauri desktop mode: ${mode}`);
if (!existsSync(tauriEntry)) throw new Error(`Pinned Tauri CLI is missing: ${tauriEntry}`);

const cargoHome = process.env.CARGO_HOME
  ? resolve(process.env.CARGO_HOME)
  : process.env.USERPROFILE
    ? resolve(process.env.USERPROFILE, ".cargo")
    : null;
const cargo = cargoHome
  ? join(cargoHome, "bin", process.platform === "win32" ? "cargo.exe" : "cargo")
  : null;
if (!cargo || !existsSync(cargo)) throw new Error("Pinned Cargo executable is unavailable.");

const env = {
  ...process.env,
  PATH: `${dirname(cargo)}${delimiter}${process.env.PATH ?? ""}`,
};
const child = spawn(process.execPath, args, {
  cwd: appRoot,
  env,
  stdio: "inherit",
  windowsHide: mode === "build",
});
child.on("error", (error) => {
  process.stderr.write(`Tauri desktop ${mode} could not start: ${error.message}\n`);
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  if (signal) {
    process.stderr.write(`Tauri desktop ${mode} stopped by ${signal}.\n`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
