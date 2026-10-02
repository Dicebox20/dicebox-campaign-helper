import { EventEmitter } from "node:events";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";
import { assertExactDesktopSelfTestCaptureTarget, captureBoundedChild } from "../tools/capture-exact-desktop-self-test.mjs";

describe("exact desktop self-test capture runner", () => {
  it("captures bounded synthetic child output and preserves a nonzero exit", async () => {
    const directory = mkdtempSync(join(tmpdir(), "dicebox-self-test-capture-"));
    try {
      const outputPath = join(directory, "receipt.json");
      const receipt = await captureBoundedChild({
        executable: process.execPath,
        args: ["-e", "process.stdout.write('synthetic-out'); process.stderr.write('synthetic-err'); process.exit(7)"],
        outputPath,
        cwd: directory,
      });
      expect(receipt.status).toBe("BLOCKED");
      expect(receipt.exitCode).toBe(7);
      expect(receipt.stdout.text).toBe("synthetic-out");
      expect(receipt.stderr.text).toBe("synthetic-err");
      expect(JSON.parse(readFileSync(outputPath, "utf8"))).toMatchObject({ operation: "dicebox.desktop.self-test.capture", exitCode: 7 });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("writes a bounded BLOCKED timeout receipt with partial trace and kill/exit disposition", async () => {
    const directory = mkdtempSync(join(tmpdir(), "dicebox-self-test-timeout-"));
    try {
      const outputPath = join(directory, "timeout-receipt.json");
      const child = new EventEmitter() as EventEmitter & { stdout: PassThrough; stderr: PassThrough; kill: () => boolean };
      child.stdout = new PassThrough();
      child.stderr = new PassThrough();
      let killCalls = 0;
      child.kill = () => {
        killCalls += 1;
        queueMicrotask(() => child.emit("exit", null, "SIGTERM"));
        return true;
      };
      const receipt = await captureBoundedChild({
        executable: process.execPath,
        outputPath,
        cwd: directory,
        timeoutMs: 5,
        timeoutGraceMs: 100,
        spawnImpl: () => {
          queueMicrotask(() => {
            child.stdout.end("partial-out");
            child.stderr.end("partial-err");
          });
          return child;
        },
      });
      expect(receipt.status).toBe("BLOCKED");
      expect(receipt.exitCode).toBeNull();
      expect(receipt.timeout).toMatchObject({ timedOut: true, timeoutMs: 5, graceMs: 100, killRequested: true, childExitObserved: true, killError: null });
      expect(killCalls).toBe(1);
      expect(receipt.stdout.text).toBe("partial-out");
      expect(receipt.stderr.text).toBe("partial-err");
      expect(JSON.parse(readFileSync(outputPath, "utf8"))).toMatchObject({ status: "BLOCKED", timeout: { timedOut: true, childExitObserved: true } });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("records a bounded grace-expired timeout when the child does not exit", async () => {
    const directory = mkdtempSync(join(tmpdir(), "dicebox-self-test-timeout-grace-"));
    try {
      const child = new EventEmitter() as EventEmitter & { stdout: PassThrough; stderr: PassThrough; kill: () => boolean };
      child.stdout = new PassThrough();
      child.stderr = new PassThrough();
      child.kill = () => true;
      const receipt = await captureBoundedChild({
        executable: process.execPath,
        outputPath: join(directory, "timeout-grace-receipt.json"),
        cwd: directory,
        timeoutMs: 5,
        timeoutGraceMs: 5,
        spawnImpl: () => child,
      });
      expect(receipt.status).toBe("BLOCKED");
      expect(receipt.timeout).toMatchObject({ timedOut: true, killRequested: true, childExitObserved: false, graceMs: 5 });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("permits only the exact debug executable and an explicit repository output file", () => {
    const root = resolve(import.meta.dirname, "..");
    const executable = join(root, "apps", "campaign-helper-desktop", "src-tauri", "target", "debug", "dicebox-campaign-helper-desktop.exe");
    expect(assertExactDesktopSelfTestCaptureTarget(executable, join(root, "outputs", "m433-test.json"))).toMatchObject({ executable: resolve(executable) });
    expect(() => assertExactDesktopSelfTestCaptureTarget(process.execPath, join(root, "outputs", "m433-test.json"))).toThrow("exact repository debug desktop executable");
    expect(() => assertExactDesktopSelfTestCaptureTarget(executable, join(root, "outside.json"))).toThrow("repository outputs directory");
  });

  it("uses resolved file paths for CLI entry detection on Windows", () => {
    const root = resolve(import.meta.dirname, "..");
    const runnerSource = readFileSync(join(root, "tools", "capture-exact-desktop-self-test.mjs"), "utf8");
    expect(runnerSource).toContain('fileURLToPath(import.meta.url)');
    expect(runnerSource).toContain('resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])');
  });
});
