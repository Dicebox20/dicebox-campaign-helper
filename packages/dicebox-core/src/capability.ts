import { z } from "zod";

export const capabilityIds = [
  "bridge.describe",
  "bridge.health",
  "bridge.query",
  "bridge.execute.readonly",
  "foundry.runtime.probe",
  "foundry.document.read",
  "foundry.scene.read",
  "foundry.scene.write",
  "foundry.scene.placeable.read",
  "foundry.scene.placeable.write",
  "foundry.region.read",
  "foundry.region.write",
  "foundry.media.deploy",
  "foundry.users.active-gm",
  "dnd5e.activities",
  "dnd5e.activity-hooks",
  "foundry.document.write",
] as const;

export type CapabilityId = (typeof capabilityIds)[number];

export const capabilityStates = ["available", "unavailable", "unknown"] as const;
export type CapabilityState = (typeof capabilityStates)[number];

export interface CapabilitySupport {
  readonly id: CapabilityId;
  readonly state: CapabilityState;
  readonly reason: string;
}

export interface RuntimeProfile {
  readonly phase: "m0" | "runtime-probe" | "ready";
  readonly foundryVersion: string | null;
  readonly systemId: string | null;
  readonly systemVersion: string | null;
  readonly observedAt: string | null;
  readonly activeModuleIds: readonly string[];
  readonly documentTypes: readonly string[];
  readonly capabilities: readonly CapabilitySupport[];
}

export interface CapabilityRegistry {
  readonly profile: RuntimeProfile;
  supports(capabilityId: CapabilityId): CapabilitySupport;
  all(): readonly CapabilitySupport[];
}

export function createCapabilityRegistry(profile: RuntimeProfile): CapabilityRegistry {
  const byId = new Map(profile.capabilities.map((capability) => [capability.id, capability]));
  return {
    profile,
    supports: (capabilityId) => byId.get(capabilityId) ?? {
      id: capabilityId,
      state: "unknown",
      reason: "Capability is not present in this runtime snapshot.",
    },
    all: () => profile.capabilities,
  };
}

export const CapabilityIdSchema = z.enum(capabilityIds);
export const CapabilitySupportSchema = z.object({
  id: CapabilityIdSchema,
  state: z.enum(capabilityStates),
  reason: z.string().min(1),
});
export const RuntimeProfileSchema = z.object({
  phase: z.enum(["m0", "runtime-probe", "ready"]),
  foundryVersion: z.string().min(1).nullable(),
  systemId: z.string().min(1).nullable(),
  systemVersion: z.string().min(1).nullable(),
  observedAt: z.string().datetime({ offset: true }).nullable(),
  activeModuleIds: z.array(z.string()),
  documentTypes: z.array(z.string()),
  capabilities: z.array(CapabilitySupportSchema),
});
