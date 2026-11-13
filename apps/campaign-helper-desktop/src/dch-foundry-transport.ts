export type DchLocalBridgeTransportProbe = Readonly<{
  operation: "dch.desktop.foundry.local-bridge-transport";
  status: "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN";
  endpoint: "127.0.0.1:8797";
  transport: "DEFAULT_PORT_REACHABLE_UNVERIFIED" | "DEFAULT_PORT_NOT_REACHABLE";
  authenticatedGmVerified: false;
  worldVerified: false;
  moduleRuntimeVerified: false;
  noFoundryWrite: true;
}>;

export function describeDchLocalBridgeTransport(report: unknown): string {
  if (!report || typeof report !== "object") {
    return "Unrecognized diagnostic. Foundry authority remains unverified.";
  }
  const value = report as Partial<DchLocalBridgeTransportProbe>;
  if (
    value.operation !== "dch.desktop.foundry.local-bridge-transport" ||
    value.status !== "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN" ||
    value.endpoint !== "127.0.0.1:8797" ||
    !["DEFAULT_PORT_REACHABLE_UNVERIFIED", "DEFAULT_PORT_NOT_REACHABLE"].includes(value.transport ?? "") ||
    value.authenticatedGmVerified !== false ||
    value.worldVerified !== false ||
    value.moduleRuntimeVerified !== false ||
    value.noFoundryWrite !== true
  ) {
    return "Unrecognized diagnostic. Foundry authority remains unverified.";
  }
  const transport = value.transport === "DEFAULT_PORT_REACHABLE_UNVERIFIED"
    ? "Default local MCP port responds to TCP"
    : "Default local MCP port is not reachable";
  return transport + ". Elected GM, exact world and loaded DCH module are NOT VERIFIED; no Foundry write.";
}
