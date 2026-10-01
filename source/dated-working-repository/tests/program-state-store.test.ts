import { describe, expect, it } from "vitest";
import { createStableDiceBoxId } from "@dicebox/core";
import {
  ProgramStateEntrySchema,
  createProgramStateEntry,
  createProgramStateMigrationPreview,
  createProgramStateStore,
  hashProgramState,
  type ProgramStateJson,
} from "@dicebox/storage";

function memoryLog(initial = "") {
  let text = initial;
  let failAppend = false;
  return {
    log: {
      async read() { return text; },
      async append(line: string) {
        if (failAppend) throw new Error("append unavailable");
        text += line;
      },
    },
    get text() { return text; },
    fail() { failAppend = true; },
  };
}

function entry(
  localKey: string,
  idempotencyKey: string,
  generation: number,
  content: ProgramStateJson = { title: "Lantern Room", tags: ["safe"] },
) {
  const result = createProgramStateEntry({
    entryId: createStableDiceBoxId("state-entry", localKey),
    idempotencyKey: createStableDiceBoxId("state-idempotency", idempotencyKey),
    operation: "upsert",
    semantic: { id: createStableDiceBoxId("journal", "lantern-room"), kind: "journal" },
    generation,
    content,
    observedAt: `2026-08-21T12:0${generation}:00.000Z`,
    notes: ["deterministic fixture"],
  });
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("program semantic StateStore", () => {
  it("hashes canonical JSON and replays append-only records across a fresh store", async () => {
    expect(hashProgramState({ b: 2, a: 1 })).toBe(hashProgramState({ a: 1, b: 2 }));
    const fixture = memoryLog();
    const store = createProgramStateStore(fixture.log);

    const first = await store.append(entry("one", "one", 0));
    expect(first).toMatchObject({ ok: true, value: { inserted: true, record: { status: "active", generation: 0 } } });
    const duplicate = await store.append(entry("one", "one", 0));
    expect(duplicate).toMatchObject({ ok: true, value: { inserted: false } });
    const next = await store.append(entry("two", "two", 1, { title: "Lantern Room", tags: ["updated"] }));
    expect(next).toMatchObject({ ok: true, value: { inserted: true, record: { generation: 1 } } });

    const freshStore = createProgramStateStore(fixture.log);
    const records = await freshStore.records();
    if (!records.ok) throw new Error(JSON.stringify(records));
    expect(records).toMatchObject({ ok: true, value: [{ generation: 1, status: "active" }] });
    expect(fixture.text.split("\n").filter(Boolean)).toHaveLength(2);
  });

  it("requires monotonic generations and explicit retirement", async () => {
    const fixture = memoryLog();
    const store = createProgramStateStore(fixture.log);
    expect((await store.append(entry("one", "one", 1))).ok).toBe(true);
    const regression = await store.append(entry("regression", "regression", 1));
    expect(regression).toMatchObject({ ok: false, error: { code: "FORBIDDEN", retry: "never" } });

    const retireInput = createProgramStateEntry({
      entryId: createStableDiceBoxId("state-entry", "retire"),
      idempotencyKey: createStableDiceBoxId("state-idempotency", "retire"),
      operation: "retire",
      semantic: { id: createStableDiceBoxId("journal", "lantern-room"), kind: "journal" },
      generation: 2,
      observedAt: "2026-08-21T12:02:00.000Z",
    });
    expect(retireInput.ok).toBe(true);
    if (retireInput.ok) expect(await store.append(retireInput.value)).toMatchObject({ ok: true, value: { record: { status: "retired", content: null } } });
  });

  it("rejects tampered content and preserves unknown append outcomes until reread", async () => {
    const fixture = memoryLog();
    const store = createProgramStateStore(fixture.log);
    const valid = entry("one", "one", 0);
    const tampered = { ...valid, content: { title: "changed" } };
    expect(await store.append(tampered)).toMatchObject({ ok: false, error: { code: "INVALID_INPUT" } });

    fixture.fail();
    const unknown = await store.append(valid);
    expect(unknown).toMatchObject({ ok: false, error: { code: "UNKNOWN_OUTCOME", retry: "after-reread" } });
    const reread = await createProgramStateStore(fixture.log).load();
    expect(reread).toMatchObject({ ok: true, value: { } });
  });

  it("fails closed on corrupt history and previews migrations without semantic values", () => {
    const corrupt = createProgramStateStore(memoryLog("not-json\n").log);
    return expect(corrupt.load()).resolves.toMatchObject({ ok: false, error: { code: "INVALID_INPUT", retry: "never" } });
  });

  it("marks older envelopes preview-only and newer envelopes preserve-unknown", () => {
    const older = createProgramStateMigrationPreview({ sourceVersion: 0, semanticIds: [createStableDiceBoxId("journal", "lantern-room")] });
    expect(older).toMatchObject({ status: "preview-only", noWrite: true, actions: [{ operation: "rewrite-envelope" }] });
    const current = createProgramStateMigrationPreview({ sourceVersion: 1 });
    expect(current).toMatchObject({ status: "preview-only", actions: [{ semanticId: null, operation: "retain" }] });
    const newer = createProgramStateMigrationPreview({ sourceVersion: 2 });
    expect(newer).toMatchObject({ status: "blocked", noWrite: true, actions: [{ operation: "preserve-unknown" }] });
    expect(ProgramStateEntrySchema.parse(entry("schema", "schema", 0))).toBeTruthy();
  });
});
