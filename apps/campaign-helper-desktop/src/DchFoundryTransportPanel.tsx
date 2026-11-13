import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

import { describeDchLocalBridgeTransport } from "./dch-foundry-transport";

function nativeProbeAvailable(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function DchFoundryTransportPanel() {
  const available = nativeProbeAvailable();
  const [result, setResult] = useState<string>(
    available ? "Not checked. This is transport-only, not GM authentication." : "Available in the installed DCH desktop app."
  );
  const [busy, setBusy] = useState(false);

  async function checkLocalPort() {
    if (!available || busy) return;
    setBusy(true);
    setResult("Checking default local MCP port only...");
    try {
      const probe = await invoke<unknown>("probe_dch_local_bridge_transport");
      setResult(describeDchLocalBridgeTransport(probe));
    } catch {
      setResult("Transport diagnostic unavailable. Foundry GM and module remain NOT VERIFIED.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="utility-harness" aria-labelledby="dch-foundry-transport-heading">
      <div className="utility-harness__heading">
        <h2 id="dch-foundry-transport-heading">DCH Foundry connection</h2>
        <span>transport-only</span>
      </div>
      <p>Checks TCP on the default local DCH MCP port 127.0.0.1:8797. It cannot establish GM identity, world authority, module activation or loaded-byte integrity.</p>
      <button type="button" disabled={!available || busy} onClick={() => void checkLocalPort()}>
        {busy ? "Checking local port..." : "Check local DCH MCP port"}
      </button>
      <output aria-live="polite">{result}</output>
    </section>
  );
}