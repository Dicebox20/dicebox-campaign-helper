import assert from "node:assert/strict";
import { test } from "node:test";
import { parseWindowsLocalTcpListeningPids } from "./m0-local-tcp-listening-pids.mjs";

const example = [
  "Active Connections",
  "  Proto  Local Address          Foreign Address        State           PID",
  "  TCP    127.0.0.1:8797         0.0.0.0:0              LISTENING       23580",
  "  TCP    127.0.0.1:9249         0.0.0.0:0              LISTENING       5551",
  "  TCP    127.0.0.1:8797         127.0.0.1:54679        ESTABLISHED     23580",
  "  TCP    127.0.0.1:87970        0.0.0.0:0              LISTENING       1112",
  "  TCP    0.0.0.0:8797           0.0.0.0:0              LISTENING       4000",
  "  TCP    [::1]:8797             [::]:0                 LISTENING       5000",
  "  UDP    127.0.0.1:8797         *:*                                    6000",
].join("\r\n");

test("exact DCH IPv4 loopback listener PID survives Windows netstat formatting", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(example, 8797), [23580]);
});
test("WebView diagnostic listener identifies its own port", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(example, 9249), [5551]);
});
test("does not accept an ESTABLISHED socket as a host LISTENING owner", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(
    "TCP 127.0.0.1:8797 127.0.0.1:5 ESTABLISHED 8888", 8797), []);
});
test("does not equate all-interfaces wildcard listener with a scoped loopback listener", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(
    "TCP 0.0.0.0:8797 0.0.0.0:0 LISTENING 8888", 8797), []);
});
test("does not confuse a different port or IPv6 address with exact requested IPv4 port", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(
    "TCP [::1]:8797 [::]:0 LISTENING 111\nTCP 127.0.0.1:87970 0.0.0.0:0 LISTENING 222", 8797), []);
});
test("duplicate listeners are deduplicated and sorted", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(
    "TCP 127.0.0.1:8797 0.0.0.0:0 LISTENING 300\n" +
    "TCP 127.0.0.1:8797 0.0.0.0:0 LISTENING 100\n" +
    "TCP 127.0.0.1:8797 0.0.0.0:0 LISTENING 300", 8797), [100, 300]);
});
test("invalid, missing and ambiguous process IDs are ignored", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids(
    "TCP 127.0.0.1:8797 0.0.0.0:0 LISTENING 0\n" +
    "TCP 127.0.0.1:8797 0.0.0.0:0 LISTENING xyz\n" +
    "TCP 127.0.0.1:8797 0.0.0.0:0 LISTENING 9007199254740999", 8797), []);
});
test("unbounded/non-port input fails closed", () => {
  for (const port of [0, 65536, -1, NaN, Infinity, "8797", 8797.5]) {
    assert.deepEqual(parseWindowsLocalTcpListeningPids(example, port), []);
  }
});
test("empty or unrelated netstat output cannot authenticate a PID", () => {
  assert.deepEqual(parseWindowsLocalTcpListeningPids("", 8797), []);
  assert.deepEqual(parseWindowsLocalTcpListeningPids(null, 8797), []);
  assert.deepEqual(parseWindowsLocalTcpListeningPids("TCP 127.0.0.1:8797 LISTENING 42", 8797), []);
});
