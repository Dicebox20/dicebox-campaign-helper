import { readFile } from "node:fs/promises";
import { webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { ActiveEffectApiEvidenceSchema, ActivityApiEvidenceSchema, ActiveGmEvidenceSchema, FoundryRuntimeEvidenceSchema, JournalApiEvidenceSchema, ManagedJournalSnapshotSchema, ReadinessCertificateSchema, RuntimeFingerprintSchema, RuntimeProbeReceiptSchema, StateStoreSelectionPlanSchema, auditFoundryRuntimeEvidence } from "@dicebox/core";

const packageRoot = fileURLToPath(new URL("../packages/dicebox-foundry/", import.meta.url));

describe("Foundry package runtime-probe shell", () => {
  it("has the target manifest and ES module entrypoint", async () => {
    const manifest = JSON.parse(await readFile(`${packageRoot}/module.json`, "utf8")) as Record<string, unknown>;
    expect(manifest.id).toBe("dicebox-campaign-helper");
    expect(manifest.version).toBe("0.1.15");
    expect(manifest.esmodules).toEqual(["src/entry-20260823-program-scene-v2.js"]);
    expect(manifest.documentTypes).toEqual({ RegionBehavior: { tramAccess: {} } });
    expect(manifest.compatibility).toMatchObject({ verified: "14.367" });
    expect(manifest.relationships).toMatchObject({ systems: [{ id: "dnd5e" }] });
  });

  it("loads the page-main bridge from the canonical module entry", async () => {
    const source = await readFile(`${packageRoot}/src/module.js`, "utf8");
    const entry = await readFile(`${packageRoot}/src/entry-20260823-program-scene-v2.js`, "utf8");
    for (const adapter of ["ascendancy-installer", "foundry-live-bridge", "tram-calibration-installer", "tram-routing-fixture-installer", "tram-rush-hour-dialog", "tram-coordinate-calibration", "tram-access-behavior", "tram-access-fixture-installer", "program-scene-vertical-slice", "signal-rune-furnishing-preview"]) {
      expect(source).toContain(`import "./${adapter}.js?dbx=0.1.21";`);
    }
    expect(source).toContain('import "./signal-rune-partial-install-preview.js?dbx=0.1.21";');
    expect(entry).toMatch(/^import "\.\/module\.js\?dbx=0\.1\.21";$/m);
    expect(entry).not.toMatch(/ascendancy-installer\.js\?dbx=/);
    expect(entry).not.toMatch(/foundry-live-bridge\.js\?dbx=/);
    expect(entry.match(/^import /gm)).toHaveLength(1);
  });

  it("loads the bootstrap without Foundry globals or world writes", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    expect(module.bootstrapDiceBoxCampaignHelper()).toEqual({
      packageId: "dicebox-campaign-helper",
      phase: "m0",
      mutationEnabled: false,
      installScheduled: false,
    });
  });

  it("records runtime metadata without exposing document writes", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const hooks = { on: () => 1, once: () => 1, call: () => true, callAll: () => undefined };
    const runtime: any = {
      Hooks: hooks,
      dnd5e: { dataModels: { fields: {
        ActivityField: class ActivityField {},
        ActivityCollection: class ActivityCollection extends Map {},
      } } },
      CONFIG: { DND5E: { activityTypes: { utility: {} } }, JournalEntryPage: { defaultType: "text" } },
      CONST: { JOURNAL_ENTRY_PAGE_FORMATS: { TEXT: 1, HTML: 2 } },
      JournalEntry: { create: () => undefined, prototype: { update: () => undefined, createEmbeddedDocuments: () => undefined } },
      fromUuid: () => undefined,
      foundry: { documents: { Actor: class Actor {} } },
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        modules: new Map([["dicebox-campaign-helper", { id: "dicebox-campaign-helper", active: true }]]),
        documentTypes: { Actor: ["base"] },
        actors: {}, items: {
          get: () => undefined,
          contents: [{
            getEmbeddedDocument: () => undefined,
            system: { activities: { contents: [{ use: () => undefined }] } },
          }],
        }, scenes: {}, journal: { contents: [
          {
            id: "journal-managed",
            uuid: "JournalEntry.world.journal-managed",
            name: "Secret title",
            pages: [{ type: "text", text: { content: "Secret content" } }],
            update: () => undefined,
            createEmbeddedDocuments: () => undefined,
            flags: {
              "dicebox-campaign-helper": {
                schemaVersion: "0.1.0",
                semanticId: "dbx:journal:managed",
                planId: "dbx:plan:managed",
              },
            },
          },
          {
            id: "journal-foreign",
            uuid: "JournalEntry.world.journal-foreign",
            name: "Foreign title",
            pages: [{ type: "text", text: { content: "Foreign content" } }],
            flags: { foreign: { owned: true } },
          },
          {
            id: "journal-invalid-marker",
            uuid: "JournalEntry.world.journal-invalid-marker",
            flags: { "dicebox-campaign-helper": { schemaVersion: "0.1.0", semanticId: "not-stable", planId: "dbx:plan:invalid" } },
          },
        ], get: () => undefined }, folders: {},
        users: { activeGM: { id: "gm-fixture" }, getDesignatedUser: () => null, find: () => undefined },
      },
    };
    const profile = module.probeRuntime(runtime) as {
      readonly phase: string;
      readonly foundryVersion: string | null;
      readonly systemId: string | null;
      readonly systemVersion: string | null;
      readonly capabilities: readonly { readonly id: string; readonly state: string }[];
      readonly runtimeFingerprint: unknown;
      readonly probeReceipt: unknown;
      readonly activeGm: unknown;
      readonly managedJournalSnapshot: unknown;
      readonly journalApi: unknown;
      readonly activityApi: unknown;
      readonly activeEffectApi: unknown;
      readonly stateStorePlan: unknown;
    };

    expect(profile).toMatchObject({ phase: "runtime-probe", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" });
    expect(profile.capabilities.find((entry) => entry.id === "foundry.document.write")).toMatchObject({ state: "unavailable" });
    expect(profile.capabilities.find((entry) => entry.id === "dnd5e.activity-hooks")).toMatchObject({ state: "unknown" });
    expect(RuntimeFingerprintSchema.parse(profile.runtimeFingerprint).exactTargetMatch).toBe(true);
    expect(RuntimeProbeReceiptSchema.parse(profile.probeReceipt)).toMatchObject({
      status: "observed",
      noWrite: true,
      operation: "foundry.runtime.probe",
    });
    expect(ActiveGmEvidenceSchema.parse(profile.activeGm)).toMatchObject({
      status: "observed",
      source: "game.users.activeGM",
      userFingerprint: expect.stringMatching(/^redacted:[0-9a-f]{8}$/),
    });
    const snapshot = ManagedJournalSnapshotSchema.parse(profile.managedJournalSnapshot);
    expect(snapshot.status).toBe("observed");
    expect(snapshot.documents).toHaveLength(1);
    expect(JSON.stringify(snapshot)).not.toContain("Secret");
    expect(snapshot.documents[0]).toMatchObject({
      semanticId: "dbx:journal:managed",
      planId: "dbx:plan:managed",
      pageCount: 1,
    });
    const journalApi = JournalApiEvidenceSchema.parse(profile.journalApi);
    expect(journalApi).toMatchObject({
      status: "observed",
      surfaces: {
        journalEntryCreate: true,
        fromUuid: true,
        journalCollectionGet: true,
        journalEntryUpdate: true,
        embeddedPageCreate: true,
      },
      page: { defaultType: "text", textFormats: [1, 2] },
    });
    const activityApi = ActivityApiEvidenceSchema.parse(profile.activityApi);
    expect(activityApi).toMatchObject({
      status: "observed",
      systemId: "dnd5e",
      registeredActivityTypes: ["utility"],
      surfaces: {
        fromUuid: true,
        itemCollectionGet: true,
        itemGetEmbeddedDocument: true,
        activityFieldClass: true,
        activityCollectionClass: true,
        activityCollectionGet: true,
        itemActivityCollectionInstance: true,
        activityUse: true,
        hookFramework: true,
        preUseActivityNamed: true,
        postUseActivityNamed: true,
      },
    });
    const activeEffectApi = ActiveEffectApiEvidenceSchema.parse(profile.activeEffectApi);
    expect(activeEffectApi.status).toBe("partial");
    expect(activeEffectApi.surfaces.activeEffectClass).toBe(false);
    expect(StateStoreSelectionPlanSchema.parse(profile.stateStorePlan)).toMatchObject({
      status: "blocked",
      evidenceClass: "deterministic",
      noWrite: true,
    });
    const diagnostic = module.createRedactedRuntimeDiagnostic(profile);
    expect(diagnostic).toMatchObject({
      redacted: true,
      noWrite: true,
      target: { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
      exactTargetMatch: true,
      activeGm: { status: "observed", isCurrentUser: null },
      readiness: { status: "blocked" },
      activityApi: {
        status: "observed",
        systemId: "dnd5e",
        registeredActivityTypes: ["utility"],
        surfaces: {
          fromUuid: true,
          itemCollectionGet: true,
          itemGetEmbeddedDocument: true,
          activityFieldClass: true,
          activityCollectionClass: true,
          activityCollectionGet: true,
          itemActivityCollectionInstance: true,
          activityUse: true,
          hookFramework: true,
          preUseActivityNamed: true,
          postUseActivityNamed: true,
        },
      },
      regionBehaviorApi: {
        status: "partial",
        registeredBehaviorTypes: [],
        surfaces: {
          fromUuid: true,
          sceneCollectionGet: false,
          regionEmbeddedCollectionRead: false,
          regionEmbeddedDocumentRead: false,
        },
      },
    });
    expect(JSON.stringify(diagnostic)).not.toContain("Secret");
    expect(JSON.stringify(diagnostic)).not.toContain("Foreign");
    expect(JSON.stringify(diagnostic)).not.toContain("notes");
  });

  it("emits only a redacted read-only diagnostic summary at the native ready boundary", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let readyCallback: (() => unknown) | undefined;
    const messages: string[] = [];
    const logs: unknown[] = [];
    const runtime: any = {
      Hooks: { once: (_name: string, callback: () => unknown) => { readyCallback = callback; return 1; } },
      console: { info: (...args: unknown[]) => logs.push(args) },
      ui: { notifications: { info: (message: string) => messages.push(message) } },
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        modules: new Map([["dicebox-campaign-helper", { id: "dicebox-campaign-helper", active: true }]]),
        documentTypes: { Actor: ["base"] },
        actors: {}, items: {}, scenes: {}, journal: {}, folders: {},
        users: { activeGM: { id: "gm-fixture" } },
      },
    };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    readyCallback?.();
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("DiceBox read-only diagnostics ready");
    expect(messages[0]).toContain("active GM observed");
    expect(logs).toHaveLength(2);
    expect(JSON.stringify(logs[0])).not.toContain("gm-fixture");
    expect(JSON.stringify(logs[0])).not.toContain("Secret");
    expect(logs[1]).toEqual(expect.arrayContaining([
      "[DiceBox][read-only-diagnostics-json]",
      expect.stringContaining('"redacted":true'),
    ]));
    expect(JSON.stringify(logs[1])).not.toContain("gm-fixture");
    expect(JSON.stringify(logs[1])).not.toContain("Secret");
    expect(runtime.game.diceboxCampaignHelper.diagnostics()).toMatchObject({ redacted: true, noWrite: true });
  });

  it("renders only the fixed redacted runtime-evidence diagnostic through a GM-visible control", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let controlHook: ((controls: Record<string, unknown>) => unknown) | undefined;
    let request: unknown;
    let dialog: Record<string, unknown> | undefined;
    const evidence = Object.freeze({
      profile: Object.freeze({ phase: "runtime-probe", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeModuleIds: Object.freeze(["dicebox-campaign-helper"]), documentTypes: Object.freeze([]), capabilities: Object.freeze([]) }),
      runtimeFingerprint: Object.freeze({ fingerprintId: "dbx:runtime:fixture", exactTargetMatch: true }),
      probeReceipt: Object.freeze({ operation: "foundry.runtime.probe", noWrite: true }),
      activeGm: Object.freeze({ status: "observed", isCurrentUser: true }),
      readinessReport: Object.freeze({ status: "blocked", summary: Object.freeze({ pass: 1, blocked: 1, unknown: 0, total: 2 }), blockers: Object.freeze([]) }),
    });
    const helper = Object.freeze({
      describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }),
      query: (candidate: unknown) => { request = candidate; return evidence; },
    });
    const runtime: any = {
      Hooks: { on: (_name: string, callback: (controls: Record<string, unknown>) => unknown) => { controlHook = callback; return 1; } },
      game: { user: { isGM: true }, diceboxCampaignHelper: helper },
      foundry: { applications: { api: { DialogV2: { wait: async (candidate: Record<string, unknown>) => { dialog = candidate; } } } } },
    };

    expect(module.registerRuntimeEvidenceDiagnosticControl(runtime)).toBe(true);
    const controls: any = { tokens: { tools: {} } };
    controlHook?.(controls);
    expect(controls.tokens.tools["dicebox-runtime-evidence-diagnostic"]).toMatchObject({
      title: "Show DiceBox Runtime Evidence Diagnostics",
      button: true,
      visible: true,
    });

    const receipt = await module.openRuntimeEvidenceDiagnosticControl(runtime);
    expect(request).toEqual({ kind: "runtime-evidence" });
    expect(receipt).toMatchObject({ operation: "dicebox.runtime-evidence.diagnostic", status: "OBSERVED", redacted: true, noWrite: true, readyClaim: false });
    expect(receipt.diagnostic).toMatchObject({ redacted: true, noWrite: true, target: { foundryVersion: "14.367" } });
    expect(JSON.stringify(dialog)).toContain("DiceBox Runtime Evidence Diagnostics");
    expect(JSON.stringify(dialog)).not.toContain("Secret");
  });

  it("fails closed for a non-GM, a missing helper, and foreign query output without adding a control", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let controlHook: ((controls: Record<string, unknown>) => unknown) | undefined;
    const nonGmRuntime: any = { Hooks: { on: (_name: string, callback: (controls: Record<string, unknown>) => unknown) => { controlHook = callback; return 1; } }, game: { user: { isGM: false } } };
    module.registerRuntimeEvidenceDiagnosticControl(nonGmRuntime);
    const controls: any = { tokens: { tools: {} } };
    controlHook?.(controls);
    expect(controls.tokens.tools).toEqual({});
    expect(module.readRuntimeEvidenceDiagnostic(nonGmRuntime)).toMatchObject({ status: "BLOCKED", redacted: true, noWrite: true });

    const missingHelperRuntime: any = { game: { user: { isGM: true } } };
    expect(module.readRuntimeEvidenceDiagnostic(missingHelperRuntime)).toMatchObject({ status: "BLOCKED", redacted: true, noWrite: true });

    const foreignHelper = Object.freeze({
      describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }),
      query: () => ({ profile: { secret: "foreign" } }),
    });
    const foreignRuntime: any = { game: { user: { isGM: true }, diceboxCampaignHelper: foreignHelper } };
    expect(module.readRuntimeEvidenceDiagnostic(foreignRuntime)).toMatchObject({ status: "BLOCKED", redacted: true, noWrite: true });
  });

  it("exposes exactly one fixed redacted RuntimeProfile query through a GM-only control", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let controlHook: ((controls: Record<string, unknown>) => unknown) | undefined;
    let dialog: Record<string, unknown> | undefined;
    const requests: unknown[] = [];
    const profile = Object.freeze({
      phase: "runtime-probe",
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      observedAt: "2026-09-06T12:00:00.000Z",
      activeModuleIds: Object.freeze(["dicebox-campaign-helper", "regionwright"]),
      documentTypes: Object.freeze(["Actor", "Item", "Scene"]),
      capabilities: Object.freeze([
        Object.freeze({ id: "bridge.query", state: "available", reason: "Read-only query surface." }),
        Object.freeze({ id: "foundry.document.write", state: "unavailable", reason: "Mutation remains disabled." }),
      ]),
    });
    const artifactIdentity = Object.freeze({
      schemaVersion: "0.1.0",
      source: "package-owned-static-descriptor",
      packageId: "dicebox-campaign-helper",
      packageVersion: "0.1.15",
      specId: "dbx:foundry-spec:current-product-0.1.15-m1259",
      verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1259",
      specSha256: "4891515e0b4a37cc180c5245991d218e79cca595146a1977b03b4cfb06e7095c",
      artifacts: Object.freeze([
        Object.freeze({ artifactId: "dbx:foundry-artifact:adapter", kind: "adapter", version: "0.1.15", sha256: "3a063c2dec5a4bf7ad7b6b13ce602ff4edcf32071c419e3ad7c5d265274113ab" }),
        Object.freeze({ artifactId: "dbx:foundry-artifact:installer", kind: "installer", version: "0.1.15", sha256: "579f96e4948bbfc7b508f29cbde57e2dd331ddee89c6be1f0464f9eaffbfe731" }),
        Object.freeze({ artifactId: "dbx:foundry-artifact:package", kind: "package", version: "0.1.15", sha256: "1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5" }),
        Object.freeze({ artifactId: "dbx:foundry-artifact:runtime", kind: "runtime", version: "14.367", sha256: "31d9655e77eed5e0e94dab33421e63537a14251df994296c3c039ce019192a1b" }),
        Object.freeze({ artifactId: "dbx:foundry-artifact:worker", kind: "worker", version: "0.1.15", sha256: "2b4f79997cab9c963c7f3826bfd2baf2b3dec256f630970a8d7cdd983743aa87" }),
      ]),
      loadedByteHash: "not-claimed-by-runtime-profile",
    });
    const helper = Object.freeze({
      describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false, artifactIdentity }),
      query: (request: unknown) => { requests.push(request); return profile; },
    });
    const runtime: any = {
      Hooks: { on: (_name: string, callback: (controls: Record<string, unknown>) => unknown) => { controlHook = callback; return 1; } },
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm-fixture", isGM: true },
        users: { activeGM: { id: "gm-fixture" } },
        diceboxCampaignHelper: helper,
      },
      foundry: { applications: { api: { DialogV2: { wait: async (candidate: Record<string, unknown>) => { dialog = candidate; } } } } },
    };

    expect(module.registerRuntimeProfileDiagnosticControl(runtime)).toBe(true);
    const controls: any = { tokens: { tools: {} } };
    controlHook?.(controls);
    expect(controls.tokens.tools["dicebox-runtime-profile-diagnostic"]).toMatchObject({
      title: "Show DiceBox RuntimeProfile Diagnostic",
      button: true,
      visible: true,
    });

    const receipt = await module.openRuntimeProfileDiagnosticControl(runtime);
    expect(requests).toEqual([{ kind: "runtime-profile" }]);
    expect(receipt).toMatchObject({
      operation: "dicebox.runtime-profile.diagnostic",
      status: "OBSERVED",
      evidenceClass: "runtime-observation",
      redacted: true,
      noWrite: true,
      queryCount: 1,
      readyClaim: false,
      target: { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", exactTargetMatch: true },
      activeGm: { status: "observed", currentUserMatchesActiveGm: true, noPermissionClaim: true, noExecutionAuthority: true },
    });
    expect(receipt.artifactIdentity).toMatchObject({
      source: "package-owned-static-descriptor",
      specId: "dbx:foundry-spec:current-product-0.1.15-m1259",
      verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1259",
      loadedByteHash: "not-claimed-by-runtime-profile",
    });
    expect(receipt.profileDiff).toEqual({
      status: "PASS_CURRENT_ARTIFACT_DESCRIPTOR",
      artifactBoundProfileFields: "descriptor-bound-separate-from-core-profile",
      identityInferred: false,
      loadedByteHashClaimed: false,
    });
    expect(receipt.profile).toMatchObject({
      phase: "runtime-probe",
      activeModuleIds: ["dicebox-campaign-helper", "regionwright"],
      documentTypes: ["Actor", "Item", "Scene"],
      capabilities: [{ id: "bridge.query", state: "available" }, { id: "foundry.document.write", state: "unavailable" }],
    });
    expect(receipt.runtimeFingerprint).toMatch(/^dbx:fingerprint:[0-9a-f]{8}$/);
    expect(JSON.stringify(dialog)).toContain("DiceBox RuntimeProfile Diagnostic");
    expect(JSON.stringify(receipt)).not.toContain("gm-fixture");
  });

  it("fails closed before or after the single fixed RuntimeProfile query", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const query = vi.fn(() => Object.freeze({ phase: "runtime-probe" }));
    const helper = Object.freeze({
      describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }),
      query,
    });
    const baseRuntime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm-fixture", isGM: true },
        users: { activeGM: { id: "gm-fixture" } },
        diceboxCampaignHelper: helper,
      },
    };
    expect(module.readRuntimeProfileDiagnostic({ ...baseRuntime, game: { ...baseRuntime.game, user: { id: "player", isGM: false } } })).toMatchObject({ status: "BLOCKED", queryCount: 0, noWrite: true, readyClaim: false });
    expect(module.readRuntimeProfileDiagnostic({ ...baseRuntime, game: { ...baseRuntime.game, version: "14.366" } })).toMatchObject({ status: "BLOCKED", queryCount: 0, noWrite: true, readyClaim: false });
    expect(module.readRuntimeProfileDiagnostic({ ...baseRuntime, game: { ...baseRuntime.game, users: { activeGM: { id: "other-gm" } } } })).toMatchObject({ status: "BLOCKED", queryCount: 0, noWrite: true, readyClaim: false });
    expect(query).not.toHaveBeenCalled();
    expect(module.readRuntimeProfileDiagnostic(baseRuntime)).toMatchObject({ status: "BLOCKED", queryCount: 1, noWrite: true, readyClaim: false });
    expect(query).toHaveBeenCalledOnce();
  });

  it("attests the executing module bytes through one fixed GM-only sidecar and module fetch", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const sidecar = JSON.parse(await readFile(`${packageRoot}/src/module-byte-attestation.json`, "utf8")) as Record<string, unknown>;
    const moduleBytes = await readFile(`${packageRoot}/src/module.js`);
    const lifecycleCallbacks = new Map<string, () => unknown>();
    const requests: Array<{ url: string; options: Record<string, unknown> }> = [];
    const runtime: any = {
      Hooks: {
        on: () => 1,
        once: (name: string, callback: () => unknown) => { lifecycleCallbacks.set(name, callback); return 1; },
        callAll: () => undefined,
      },
      crypto: webcrypto,
      fetch: async (url: string, options: Record<string, unknown>) => {
        requests.push({ url, options });
        if (url.includes("module-byte-attestation.json")) return { ok: true, status: 200, text: async () => JSON.stringify(sidecar) };
        return { ok: true, status: 200, arrayBuffer: async () => moduleBytes.buffer.slice(moduleBytes.byteOffset, moduleBytes.byteOffset + moduleBytes.byteLength) };
      },
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm-fixture", isGM: true },
        users: { activeGM: { id: "gm-fixture" } },
        modules: new Map(),
        actors: {},
        items: {},
        scenes: {},
        journal: {},
        folders: {},
      },
    };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    lifecycleCallbacks.get("init")?.();
    lifecycleCallbacks.get("ready")?.();

    const receipt = await module.readLoadedByteAttestation(runtime);
    expect(receipt).toMatchObject({
      operation: "dicebox.loaded-byte-attestation",
      status: "OBSERVED",
      evidenceClass: "runtime-observation",
      noWrite: true,
      readyClaim: false,
      loadedByte: { modulePath: "src/module.js", match: true, expectedSha256: sidecar.moduleSha256, observedSha256: sidecar.moduleSha256, expectedBytes: moduleBytes.byteLength, observedBytes: moduleBytes.byteLength },
    });
    expect(requests).toHaveLength(2);
    expect(requests.every(({ options }) => options)).toBe(true);
    expect(requests.map(({ options }) => options)).toEqual([
      { method: "GET", cache: "no-store", credentials: "same-origin", redirect: "error" },
      { method: "GET", cache: "no-store", credentials: "same-origin", redirect: "error" },
    ]);
    expect(JSON.stringify(receipt)).not.toContain("gm-fixture");

    const blockedPlayer = await module.readLoadedByteAttestation({ ...runtime, game: { ...runtime.game, user: { id: "player", isGM: false } } });
    expect(blockedPlayer).toMatchObject({ status: "BLOCKED", noWrite: true, readyClaim: false });
    expect(requests).toHaveLength(2);
  });

  it("refuses a loaded-byte mismatch without retrying or opening a mutation path", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const sidecar = JSON.parse(await readFile(`${packageRoot}/src/module-byte-attestation.json`, "utf8")) as Record<string, unknown>;
    const lifecycleCallbacks = new Map<string, () => unknown>();
    let fetchCount = 0;
    const runtime: any = {
      Hooks: { on: () => 1, once: (name: string, callback: () => unknown) => { lifecycleCallbacks.set(name, callback); return 1; }, callAll: () => undefined },
      crypto: webcrypto,
      fetch: async (url: string) => {
        fetchCount += 1;
        if (url.includes("module-byte-attestation.json")) return { ok: true, status: 200, text: async () => JSON.stringify(sidecar) };
        return { ok: true, status: 200, arrayBuffer: async () => new TextEncoder().encode("foreign module bytes").buffer };
      },
      game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm-fixture", isGM: true }, users: { activeGM: { id: "gm-fixture" } }, modules: new Map(), actors: {}, items: {}, scenes: {}, journal: {}, folders: {} },
    };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    lifecycleCallbacks.get("init")?.();
    lifecycleCallbacks.get("ready")?.();
    await expect(module.readLoadedByteAttestation(runtime)).resolves.toMatchObject({ status: "BLOCKED", noWrite: true, readyClaim: false });
    expect(fetchCount).toBe(2);
  });

  it("renders only a fixed redacted current-active-GM identity snapshot and never a permission claim", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let controlHook: ((controls: Record<string, unknown>) => unknown) | undefined;
    let dialog: Record<string, unknown> | undefined;
    const helper = Object.freeze({ describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }), query: () => undefined });
    const runtime: any = {
      Hooks: { on: (_name: string, callback: (controls: Record<string, unknown>) => unknown) => { controlHook = callback; return 1; } },
      game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm-fixture", isGM: true }, users: { activeGM: { id: "gm-fixture" } }, diceboxCampaignHelper: helper },
      foundry: { applications: { api: { DialogV2: { wait: async (candidate: Record<string, unknown>) => { dialog = candidate; } } } } },
    };
    expect(module.registerCurrentActiveGmAuthorityDiagnosticControl(runtime)).toBe(true);
    const controls: any = { tokens: { tools: {} } };
    controlHook?.(controls);
    expect(controls.tokens.tools["dicebox-current-active-gm-authority-diagnostic"]).toMatchObject({ title: "Show DiceBox Current Active-GM Diagnostic", button: true, visible: true });
    const receipt = await module.openCurrentActiveGmAuthorityDiagnosticControl(runtime);
    expect(receipt).toMatchObject({ operation: "dicebox.current-active-gm-authority.diagnostic", status: "OBSERVED", redacted: true, noWrite: true, noPermissionClaim: true, noExecutionAuthority: true, currentUserIsGm: true, currentUserMatchesActiveGm: true, readyClaim: false });
    expect(JSON.stringify(receipt)).not.toContain("gm-fixture");
    expect(JSON.stringify(dialog)).toContain("DiceBox Current Active-GM Diagnostic");
    expect(JSON.stringify(dialog)).not.toContain("gm-fixture");
  });

  it("fails closed for target mismatch, non-GM, active-GM mismatch, and an untrusted package descriptor", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const helper = Object.freeze({ describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }), query: () => undefined });
    const runtime: any = { game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm-fixture", isGM: true }, users: { activeGM: { id: "gm-fixture" } }, diceboxCampaignHelper: helper } };
    expect(module.readCurrentActiveGmAuthorityDiagnostic({ ...runtime, game: { ...runtime.game, version: "14.366" } })).toMatchObject({ status: "BLOCKED", noPermissionClaim: true });
    expect(module.readCurrentActiveGmAuthorityDiagnostic({ ...runtime, game: { ...runtime.game, user: { id: "gm-fixture", isGM: false } } })).toMatchObject({ status: "BLOCKED", noPermissionClaim: true });
    expect(module.readCurrentActiveGmAuthorityDiagnostic({ ...runtime, game: { ...runtime.game, users: { activeGM: { id: "another-gm" } } } })).toMatchObject({ status: "BLOCKED", noPermissionClaim: true });
    expect(module.readCurrentActiveGmAuthorityDiagnostic({ ...runtime, game: { ...runtime.game, diceboxCampaignHelper: { describe: helper.describe, query: helper.query } } })).toMatchObject({ status: "BLOCKED", noPermissionClaim: true });
  });

  it("reads only one exact owned Scene permission predicate without invoking an update", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let controlHook: ((controls: Record<string, unknown>) => unknown) | undefined;
    let dialog: Record<string, unknown> | undefined;
    const canUserModify = vi.fn(() => true);
    const update = vi.fn();
    const scene = {
      name: "Sensitive fixture name",
      update,
      canUserModify,
      flags: { "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: "dbx:package:program-scene-vertical-slice-v1", planSha256: "10c4925a5eabdb7c0f6537440d2f083b1c999ca27fd6719f61f36eafed946c1e", adapterVersion: "0.1.0", kind: "scene", stableId: "dbx:scene:desktop-shell-fixture" } } },
    };
    const helper = Object.freeze({ describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }), query: () => undefined });
    const runtime: any = {
      Hooks: { on: (_name: string, callback: (controls: Record<string, unknown>) => unknown) => { controlHook = callback; return 1; } },
      game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm-fixture", isGM: true }, users: { activeGM: { id: "gm-fixture" } }, scenes: { contents: [scene] }, diceboxCampaignHelper: helper },
      foundry: { applications: { api: { DialogV2: { wait: async (candidate: Record<string, unknown>) => { dialog = candidate; } } } } },
    };
    expect(module.registerOwnedScenePermissionDiagnosticControl(runtime)).toBe(true);
    const controls: any = { tokens: { tools: {} } };
    controlHook?.(controls);
    expect(controls.tokens.tools["dicebox-owned-scene-permission-diagnostic"]).toMatchObject({ title: "Show DiceBox Owned-Scene Permission Diagnostic", button: true, visible: true });
    const receipt = await module.openOwnedScenePermissionDiagnosticControl(runtime);
    expect(receipt).toMatchObject({ operation: "dicebox.owned-scene-permission.diagnostic", status: "OBSERVED", ownedSceneCanUpdate: true, redacted: true, noWrite: true, noUpdateInvoked: true, noGenericAuthorityClaim: true, noExecutionAuthority: true, readyClaim: false });
    expect(canUserModify).toHaveBeenCalledOnce();
    expect(canUserModify).toHaveBeenCalledWith(runtime.game.user, "update");
    expect(update).not.toHaveBeenCalled();
    expect(JSON.stringify(receipt)).not.toContain("gm-fixture");
    expect(JSON.stringify(receipt)).not.toContain("Sensitive fixture name");
    expect(JSON.stringify(dialog)).toContain("DiceBox Owned-Scene Permission Diagnostic");
    expect(JSON.stringify(dialog)).not.toContain("gm-fixture");
    expect(JSON.stringify(dialog)).not.toContain("Sensitive fixture name");
  });

  it("fails closed without reading a predicate for a missing, duplicate, foreign, absent-API, or inactive-GM Scene", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const helper = Object.freeze({ describe: () => Object.freeze({ packageId: "dicebox-campaign-helper", mutationEnabled: false }), query: () => undefined });
    const owned = (canUserModify: unknown = vi.fn(() => true)) => ({ canUserModify, update: vi.fn(), flags: { "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: "dbx:package:program-scene-vertical-slice-v1", planSha256: "10c4925a5eabdb7c0f6537440d2f083b1c999ca27fd6719f61f36eafed946c1e", adapterVersion: "0.1.0", kind: "scene", stableId: "dbx:scene:desktop-shell-fixture" } } } });
    const runtime = (scenes: unknown[], activeGm = "gm-fixture") => ({ game: { version: "14.367", system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm-fixture", isGM: true }, users: { activeGM: { id: activeGm } }, scenes: { contents: scenes }, diceboxCampaignHelper: helper } });
    const missing = module.readOwnedScenePermissionDiagnostic(runtime([]));
    expect(missing).toMatchObject({ status: "BLOCKED", noUpdateInvoked: true, noGenericAuthorityClaim: true });
    const first = owned();
    const second = owned();
    expect(module.readOwnedScenePermissionDiagnostic(runtime([first, second]))).toMatchObject({ status: "BLOCKED" });
    expect(first.canUserModify).not.toHaveBeenCalled();
    expect(second.canUserModify).not.toHaveBeenCalled();
    const foreign = { ...owned(), flags: { "dicebox-campaign-helper": { managed: { owner: "foreign", stableId: "dbx:scene:desktop-shell-fixture" } } } };
    expect(module.readOwnedScenePermissionDiagnostic(runtime([foreign]))).toMatchObject({ status: "BLOCKED" });
    expect(foreign.canUserModify).not.toHaveBeenCalled();
    const absentApi = owned(null);
    expect(module.readOwnedScenePermissionDiagnostic(runtime([absentApi]))).toMatchObject({ status: "BLOCKED" });
    expect(absentApi.update).not.toHaveBeenCalled();
    const inactive = owned();
    expect(module.readOwnedScenePermissionDiagnostic(runtime([inactive], "different-gm"))).toMatchObject({ status: "BLOCKED" });
    expect(inactive.canUserModify).not.toHaveBeenCalled();
  });

  it("classifies a version mismatch without enabling writes", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const runtime: any = {
      Hooks: { on: () => 1, once: () => 1, callAll: () => undefined },
      game: {
        version: "14.366",
        system: { id: "dnd5e", version: "5.3.3" },
        modules: new Map(),
        documentTypes: { JournalEntry: ["base"] },
        actors: {}, items: {}, scenes: {}, journal: {}, folders: {},
        users: { getDesignatedUser: () => null },
      },
    };
    const profile = module.probeRuntime(runtime) as { readonly runtimeFingerprint: unknown; readonly probeReceipt: unknown };

    expect(RuntimeFingerprintSchema.parse(profile.runtimeFingerprint).exactTargetMatch).toBe(false);
    expect(RuntimeProbeReceiptSchema.parse(profile.probeReceipt)).toMatchObject({ status: "mismatch", noWrite: true });
  });

  it("waits for ready and does not replace an existing diagnostics namespace", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const lifecycleCallbacks = new Map<string, () => unknown>();
    let readyCallback: (() => unknown) | undefined;
    const runtime: any = {
      Hooks: { once: (name: string, callback: () => unknown) => { lifecycleCallbacks.set(name, callback); if (name === "ready") readyCallback = callback; return 1; }, on: () => 1 },
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        modules: new Map(),
        actors: {}, items: {}, scenes: {}, journal: {}, folders: {},
        users: { getDesignatedUser: () => null, find: () => undefined },
      },
    };
    const scheduled = module.bootstrapDiceBoxCampaignHelper(runtime);

    expect(scheduled).toMatchObject({ phase: "runtime-probe", installScheduled: true, mutationEnabled: false });
    expect(lifecycleCallbacks.get("init")).toBeTypeOf("function");
    expect(readyCallback).toBeTypeOf("function");
    lifecycleCallbacks.get("init")?.();
    readyCallback?.();
    expect(runtime.game.diceboxCampaignHelper).toBeDefined();
    expect(runtime.game.diceboxCampaignHelper.describe()).toMatchObject({
      mutationEnabled: false,
      artifactIdentity: {
        source: "package-owned-static-descriptor",
        packageId: "dicebox-campaign-helper",
        packageVersion: "0.1.15",
        specId: "dbx:foundry-spec:current-product-0.1.15-m1259",
        verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1259",
        loadedByteHash: "not-claimed-by-runtime-profile",
        artifacts: expect.arrayContaining([
          expect.objectContaining({ artifactId: "dbx:foundry-artifact:installer", sha256: "579f96e4948bbfc7b508f29cbde57e2dd331ddee89c6be1f0464f9eaffbfe731" }),
          expect.objectContaining({ artifactId: "dbx:foundry-artifact:worker", sha256: "2b4f79997cab9c963c7f3826bfd2baf2b3dec256f630970a8d7cdd983743aa87" }),
        ]),
      },
    });
    const evidence = runtime.game.diceboxCampaignHelper.query({ kind: "runtime-evidence" });
    expect(evidence).toMatchObject({
      profile: { phase: "runtime-probe", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
      runtimeFingerprint: { fingerprintId: expect.any(String), exactTargetMatch: true },
      probeReceipt: { operation: "foundry.runtime.probe", noWrite: true },
    });
    expect((evidence.profile as Record<string, unknown>).runtimeFingerprint).toBeUndefined();
    const parsedEvidence = FoundryRuntimeEvidenceSchema.parse(evidence);
    expect(auditFoundryRuntimeEvidence(parsedEvidence)).toMatchObject({
      status: "reviewable",
      readyClaim: false,
      foundryApiEvidence: "structured-only",
      exactTargetMatch: true,
    });
    expect(RuntimeFingerprintSchema.parse(evidence.runtimeFingerprint).exactTargetMatch).toBe(true);
    expect(RuntimeProbeReceiptSchema.parse(evidence.probeReceipt).noWrite).toBe(true);
    expect(ReadinessCertificateSchema.parse(evidence.readinessCertificate.certificate)).toMatchObject({
      status: "blocked",
      evidenceClass: "deterministic",
      noWrite: true,
      summary: { total: 6 },
    });
    expect(evidence.readinessCertificate.certificate.blockers.some((entry: { laneId: string }) => entry.laneId === "exact-runtime")).toBe(true);
    expect(ActiveGmEvidenceSchema.parse(evidence.activeGm).status).toBe("unknown");
    expect(ManagedJournalSnapshotSchema.parse(evidence.managedJournalSnapshot).status).toBe("unavailable");
    expect(JournalApiEvidenceSchema.parse(evidence.journalApi).status).toBe("unavailable");
    expect(ActivityApiEvidenceSchema.parse(evidence.activityApi).status).toBe("unavailable");
    expect(ActiveEffectApiEvidenceSchema.parse(evidence.activeEffectApi).status).toBe("unavailable");
    expect(StateStoreSelectionPlanSchema.parse(evidence.stateStorePlan).status).toBe("blocked");
    expect(runtime.game.diceboxCampaignHelper.resolve({ id: "dbx:room:entrance", kind: "scene" }).error.code).toBe("NOT_READY");

    const existing = { sentinel: true };
    const secondRuntime = { ...runtime, game: { ...runtime.game, diceboxCampaignHelper: existing } };
    module.bootstrapDiceBoxCampaignHelper(secondRuntime);
    expect(secondRuntime.game.diceboxCampaignHelper).toBe(existing);
  });
});
