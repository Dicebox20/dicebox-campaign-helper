import { mkdir, mkdtemp, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stageFixtureLicense } from "../tools/stage-fixture-license.mjs";

function hash(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "dbx-license-"));
  const sourceRoot = join(root, "v2");
  const destinationRoot = join(root, "v3");
  await mkdir(join(sourceRoot, "Config"), { recursive: true });
  await mkdir(join(destinationRoot, "Config"), { recursive: true });
  await mkdir(join(destinationRoot, "Data", "worlds", "dbx-test-world"), { recursive: true });
  await writeFile(join(destinationRoot, "Data", "worlds", "dbx-test-world", "world.json"), "world");
  const sourceBytes = Buffer.from('{"signature":"fixture-license"}\n', "utf8");
  await writeFile(join(sourceRoot, "Config", "license.json"), sourceBytes);
  return { root, sourceRoot, destinationRoot, sourceBytes };
}

describe("fixture license staging", () => {
  it("copies only the exact license file and rereads its bytes", async () => {
    const { sourceRoot, destinationRoot, sourceBytes } = await fixture();
    const receipt = await stageFixtureLicense({ sourceRoot, destinationRoot, now: () => new Date("2026-08-27T13:30:00.000Z") });
    expect(receipt.status).toBe("PASS");
    expect(receipt.source).toEqual({ bytes: sourceBytes.length, sha256: hash(sourceBytes) });
    expect(receipt.destination).toEqual({ bytes: sourceBytes.length, sha256: hash(sourceBytes) });
    expect(receipt.copyScope).toEqual(["Config/license.json"]);
    expect(await readFile(join(destinationRoot, "Config", "license.json"))).toEqual(sourceBytes);
    expect(await readFile(join(destinationRoot, "Data", "worlds", "dbx-test-world", "world.json"), "utf8")).toBe("world");
    expect(await readdir(join(destinationRoot, "Config"))).toEqual(["license.json"]);
  });

  it("refuses an existing destination without overwriting it", async () => {
    const { sourceRoot, destinationRoot } = await fixture();
    const destination = join(destinationRoot, "Config", "license.json");
    await writeFile(destination, "foreign-license");
    const receipt = await stageFixtureLicense({ sourceRoot, destinationRoot });
    expect(receipt.status).toBe("BLOCKED");
    expect(receipt.blockers).toContain("The destination Config/license.json already exists; overwrite is refused.");
    expect(await readFile(destination, "utf8")).toBe("foreign-license");
  });

  it("refuses missing, overlapping, and non-directory boundaries", async () => {
    const { sourceRoot, destinationRoot, root } = await fixture();
    const missing = await stageFixtureLicense({ sourceRoot: join(root, "missing"), destinationRoot });
    expect(missing.status).toBe("BLOCKED");
    const overlapping = await stageFixtureLicense({ sourceRoot, destinationRoot: sourceRoot });
    expect(overlapping.status).toBe("BLOCKED");
    await writeFile(join(root, "file-root"), "not-a-root");
    const invalid = await stageFixtureLicense({ sourceRoot, destinationRoot: join(root, "file-root") });
    expect(invalid.status).toBe("BLOCKED");
    await expect(stat(join(root, "file-root"))).resolves.toBeTruthy();
  });
});
