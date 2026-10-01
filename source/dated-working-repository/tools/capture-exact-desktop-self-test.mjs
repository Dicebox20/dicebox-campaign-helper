import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(import.meta.dirname, "..");
const exactDebugExecutable = resolve(root, "apps", "campaign-helper-desktop", "src-tauri", "target", "debug", "dicebox-campaign-helper-desktop.exe");
const maxTraceBytes = 64 * 1024;
const defaultTimeoutMs = 30_000;
const defaultTimeoutGraceMs = 5_000;

function boundedText(value) {
  const text = String(value ?? "");
  if (Buffer.byteLength(text, "utf8") <= maxTraceBytes) return { text, truncated: false };
  const bytes = Buffer.from(text, "utf8");
  return { text: bytes.subarray(0, maxTraceBytes).toString("utf8"), truncated: true };
}

function captureOutput(stream) {
  let value = "";
  let truncated = false;
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    const next = boundedText(value + chunk);
    value = next.text;
    truncated ||= next.truncated;
  });
  return () => ({ text: value, truncated });
}

export async function captureBoundedChild({ executable, args = [], outputPath, cwd, timeoutMs = defaultTimeoutMs, timeoutGraceMs = defaultTimeoutGraceMs, spawnImpl = spawn }) {
  if (!executable || !outputPath) throw new Error("Capture requires explicit executable and output paths.");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60_000) throw new Error("Capture timeout must be an integer from 1 through 60000 milliseconds.");
  if (!Number.isInteger(timeoutGraceMs) || timeoutGraceMs < 1 || timeoutGraceMs > 60_000) throw new Error("Capture timeout grace must be an integer from 1 through 60000 milliseconds.");
  const child = spawnImpl(executable, args, { cwd: cwd ?? dirname(executable), windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  const stdout = captureOutput(child.stdout);
  const stderr = captureOutput(child.stderr);
  const result = await new Promise((resolveResult, rejectResult) => {
    let timer;
    let graceTimer;
    let settled = false;
    let timedOut = false;
    let killRequested = false;
    let killError;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(graceTimer);
      resolveResult(value);
    };
    const onExit = (exitCode, signal) => finish({ exitCode, signal, timedOut, killRequested, killError, childExitObserved: true });
    const onError = (error) => {
      if (!timedOut) {
        settled = true;
        clearTimeout(timer);
        rejectResult(error);
        return;
      }
      finish({ exitCode: null, signal: null, timedOut: true, killRequested, killError, childError: error instanceof Error ? error.message : String(error), childExitObserved: false });
    };
    timer = setTimeout(() => {
      timedOut = true;
      try {
        killRequested = child.kill();
      } catch (error) {
        killError = error instanceof Error ? error.message : String(error);
      }
      graceTimer = setTimeout(() => finish({ exitCode: null, signal: null, timedOut: true, killRequested, killError, childExitObserved: false }), timeoutGraceMs);
    }, timeoutMs);
    child.once("error", onError);
    child.once("exit", onExit);
  });
  const receipt = {
    operation: "dicebox.desktop.self-test.capture",
    status: !result.timedOut && result.exitCode === 0 && result.signal === null ? "PASS" : "BLOCKED",
    executable: resolve(executable),
    executableName: basename(executable),
    exitCode: result.exitCode,
    signal: result.signal,
    stdout: stdout(),
    stderr: stderr(),
    timeout: {
      timedOut: result.timedOut,
      timeoutMs,
      graceMs: result.timedOut ? timeoutGraceMs : null,
      killRequested: result.timedOut ? result.killRequested : false,
      childExitObserved: result.timedOut ? result.childExitObserved : true,
      killError: result.timedOut ? result.killError ?? null : null,
      childError: result.timedOut ? result.childError ?? null : null,
    },
    noProjectOrSessionInspection: true,
    noRecoveryInvocationByRunner: true,
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return receipt;
}

export function assertExactDesktopSelfTestCaptureTarget(executableInput, outputInput) {
  const executable = resolve(executableInput);
  const outputPath = resolve(outputInput);
  if (executable !== exactDebugExecutable) throw new Error("Capture accepts only the exact repository debug desktop executable.");
  const outputsRoot = resolve(root, "outputs");
  if (relative(outputsRoot, outputPath).startsWith("..") || outputPath === outputsRoot) throw new Error("Capture output must be an explicit file inside the repository outputs directory.");
  return { executable, outputPath };
}

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a path.`);
  return value;
}

const isMainModule = process.argv[1] !== undefined
  && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);

if (isMainModule) {
  try {
    const { executable, outputPath } = assertExactDesktopSelfTestCaptureTarget(argumentValue("--executable"), argumentValue("--output"));
    const receipt = await captureBoundedChild({ executable, outputPath });
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
    if (receipt.status !== "PASS") process.exitCode = 2;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  }
}
