/**
 * DCH M0 Windows-only read-only listener identity helper.
 * TCP reachability is not host identity: bind a local port to the actual PID.
 * Neither this helper nor its callers establish Foundry GM authentication.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

export function parseWindowsLocalTcpListeningPids(output, port) {
  if (typeof output !== "string" || !Number.isSafeInteger(port) ||
      port < 1 || port > 65535) {
    return [];
  }
  const localAddress = "127.0.0.1:" + port;
  const ids = new Set();
  for (const line of output.split(/\r?\n/)) {
    const fields = line.trim().split(/\s+/);
    if (fields.length !== 5 ||
        fields[0].toUpperCase() !== "TCP" ||
        fields[1] !== localAddress ||
        fields[3].toUpperCase() !== "LISTENING" ||
        !/^[1-9][0-9]*$/.test(fields[4])) continue;
    const pid = Number(fields[4]);
    if (Number.isSafeInteger(pid)) ids.add(pid);
  }
  return [...ids].sort((a, b) => a - b);
}

export function readWindowsLocalTcpListeningPids(port) {
  if (process.platform !== "win32") {
    throw Error("DCH_WINDOWS_PROCESS_BINDING_NOT_SUPPORTED");
  }
  const systemRoot = process.env.SystemRoot;
  if (!systemRoot || !/^[a-zA-Z]:[\\/]/.test(systemRoot)) {
    throw Error("DCH_WINDOWS_SYSTEM_ROOT_NOT_VERIFIED");
  }
  const netstat = resolve(systemRoot, "System32", "netstat.exe");
  const stdout = execFileSync(netstat, ["-ano", "-p", "tcp"], {
    encoding: "utf8", timeout: 4500, maxBuffer: 1024 * 1024, windowsHide: true,
  });
  return parseWindowsLocalTcpListeningPids(stdout, port);
}
