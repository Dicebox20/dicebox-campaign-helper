import { describe, expect, it } from "vitest";
import {
  createFoundryFileBrowseReadAdapter,
} from "@dicebox/bridge";

const query = {
  source: "data" as const,
  ownedRoot: "assets/dicebox",
  target: "assets/dicebox/maps",
  extensions: [".webp", ".png"],
};

describe("read-only Foundry FilePicker browse adapter", () => {
  it("browses only the reviewed root and returns sorted metadata", async () => {
    let calls = 0;
    const adapter = createFoundryFileBrowseReadAdapter({
      FilePicker: {
        browse: async (source, target, options) => {
          calls += 1;
          expect(source).toBe("data");
          expect(target).toBe("assets/dicebox/maps");
          expect(options?.extensions).toEqual([".webp", ".png"]);
          return {
            files: ["assets/dicebox/maps/z.webp", "assets/dicebox/maps/a.png", "assets/dicebox/maps/a.png"],
            dirs: ["assets/dicebox/maps/tokens", "assets/dicebox/maps/backgrounds", "assets/dicebox/maps/tokens"],
          };
        },
      },
    });

    const result = await adapter.browse(query);

    expect(adapter.adapterId).toBe("foundry.file-browse.read@14.367");
    expect(adapter.foundryApi.browse).toBe("FilePicker.browse");
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        source: "data",
        target: "assets/dicebox/maps",
        files: ["assets/dicebox/maps/a.png", "assets/dicebox/maps/z.webp"],
        directories: ["assets/dicebox/maps/backgrounds", "assets/dicebox/maps/tokens"],
      },
    });
  });

  it("rejects path traversal or targets outside the reviewed asset root before calling Foundry", async () => {
    let calls = 0;
    const adapter = createFoundryFileBrowseReadAdapter({
      FilePicker: { browse: async () => { calls += 1; return { files: [], dirs: [] }; } },
    });

    const outside = await adapter.browse({ ...query, target: "assets/other" });
    const traversal = await adapter.browse({ ...query, target: "assets/dicebox/../other" });

    expect(calls).toBe(0);
    for (const result of [outside, traversal]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("INVALID_INPUT");
    }
  });

  it("fails closed when FilePicker is unavailable or returns malformed metadata", async () => {
    const unavailable = createFoundryFileBrowseReadAdapter({});
    const malformed = createFoundryFileBrowseReadAdapter({
      FilePicker: { browse: async () => ({ files: ["a.png"] }) },
    });

    const unavailableResult = await unavailable.browse(query);
    const malformedResult = await malformed.browse(query);

    expect(unavailableResult.ok).toBe(false);
    if (!unavailableResult.ok) expect(unavailableResult.error.code).toBe("UNAVAILABLE");
    expect(malformedResult.ok).toBe(false);
    if (!malformedResult.ok) {
      expect(malformedResult.error.code).toBe("UNKNOWN_OUTCOME");
      expect(malformedResult.error.retry).toBe("after-reread");
    }
  });

  it("preserves unknown outcome when FilePicker.browse fails", async () => {
    const adapter = createFoundryFileBrowseReadAdapter({
      FilePicker: { browse: async () => { throw new Error("browse timeout"); } },
    });

    const result = await adapter.browse(query);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_OUTCOME");
      expect(result.error.retry).toBe("after-reread");
    }
  });

  it("rejects invalid sources and extensions without exposing upload/delete APIs", async () => {
    const adapter = createFoundryFileBrowseReadAdapter({
      FilePicker: { browse: async () => ({ files: [], dirs: [] }) },
    });

    const badSource = await adapter.browse({ ...query, source: "private" as "data" });
    const badExtension = await adapter.browse({ ...query, extensions: ["png"] });

    expect(badSource.ok).toBe(false);
    expect(badExtension.ok).toBe(false);
    expect("upload" in adapter).toBe(false);
    expect("delete" in adapter).toBe(false);
  });
});
