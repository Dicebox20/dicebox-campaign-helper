import { describe, expect, it } from "vitest";
import { selectGamemasterTab } from "@dicebox/core";

const targetUrl = "http://localhost:30000/game";

function tab(accountLabel: string, providerTabId: string, url = targetUrl) {
  return {
    tabId: providerTabId,
    providerTabId,
    title: "Foundry Virtual Tabletop",
    url,
    accountLabel,
    lastOpened: "2026-08-21T12:00:00.000Z",
  };
}

describe("supported Gamemaster Chrome harness selector", () => {
  it("selects the exact Gamemaster tab and preserves the Assistant tab", () => {
    const receipt = selectGamemasterTab([
      tab("Gamemaster [GM]", "provider-gm"),
      tab("Assistant Gamemaster [GM]", "provider-assistant"),
    ]);

    expect(receipt).toMatchObject({ status: "PASS", noChromeMutation: true, noWorldMutation: true });
    expect(receipt.selected?.providerTabId).toBe("provider-gm");
    expect(receipt.preserved.map((candidate) => candidate.providerTabId)).toEqual(["provider-assistant"]);
  });

  it("blocks ambiguous or stale observations instead of guessing", () => {
    expect(selectGamemasterTab([
      tab("Gamemaster [GM]", "provider-one"),
      tab("Gamemaster [GM]", "provider-two"),
    ])).toMatchObject({ status: "BLOCKED", selected: null });
    expect(selectGamemasterTab([tab("Gamemaster [GM]", "provider-stale", "http://localhost:30001/game")])).toMatchObject({ status: "BLOCKED", selected: null });
  });

  it("requires the visible account label and exact tab snapshot", () => {
    expect(selectGamemasterTab([{ tabId: "gm", providerTabId: "gm", title: "Foundry Virtual Tabletop", url: targetUrl }])).toMatchObject({ status: "BLOCKED", selected: null });
    expect(selectGamemasterTab([tab("Assistant Gamemaster [GM]", "provider-assistant")])).toMatchObject({ status: "BLOCKED", selected: null });
  });
});
