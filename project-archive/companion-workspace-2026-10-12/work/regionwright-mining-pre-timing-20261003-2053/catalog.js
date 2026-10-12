export const MODULE_ID = "regionwright-mining";

export const ORE_CATALOG = Object.freeze({
  iron: Object.freeze({
    id: "iron", name: "Iron Ore", rarity: "common", value: 5, denomination: "cp",
    img: "modules/regionwright-mining/assets/ore/iron-ore.svg",
    description: "A one-pound chunk of iron-bearing ore from the stone around Blingdenstone."
  }),
  copper: Object.freeze({
    id: "copper", name: "Copper Ore", rarity: "common", value: 2, denomination: "sp",
    img: "modules/regionwright-mining/assets/ore/copper-ore.svg",
    description: "A one-pound chunk of copper-bearing ore. Blingdenstone smiths and traders buy it readily."
  }),
  tin: Object.freeze({
    id: "tin", name: "Tin Ore", rarity: "common", value: 3, denomination: "sp",
    img: "modules/regionwright-mining/assets/ore/tin-ore.svg",
    description: "A one-pound chunk of tin-bearing ore, useful for alloy work such as bronze."
  }),
  silver: Object.freeze({
    id: "silver", name: "Silver Ore", rarity: "uncommon", value: 2, denomination: "gp",
    img: "modules/regionwright-mining/assets/ore/silver-ore.svg",
    description: "A one-pound chunk of silver-bearing ore. Valuable, but still needs refining."
  }),
  gold: Object.freeze({
    id: "gold", name: "Gold Ore", rarity: "rare", value: 20, denomination: "gp",
    img: "modules/regionwright-mining/assets/ore/gold-ore.svg",
    description: "A one-pound chunk of rich gold-bearing ore from a productive seam."
  }),
  mithral: Object.freeze({
    id: "mithral", name: "Mithral Ore", rarity: "veryRare", value: 50, denomination: "gp",
    img: "modules/regionwright-mining/assets/ore/mithral-ore.svg",
    description: "A one-pound silver-black piece of rare Underdark mithral ore, prized by master smiths."
  }),
  adamantite: Object.freeze({
    id: "adamantite", name: "Adamantite Ore", rarity: "legendary", value: 75, denomination: "gp",
    img: "modules/regionwright-mining/assets/ore/adamantite-ore.svg",
    description: "A one-pound chunk of exceptionally rare adamantite-bearing ore. Refining it safely is specialist work."
  })
});

export const ORE_ORDER = Object.freeze(["iron","copper","tin","silver","gold","mithral","adamantite"]);

export function normalizeOreId(value) {
  const id = String(value ?? "").trim().toLowerCase();
  return ORE_CATALOG[id] ? id : null;
}

export function getOre(value) {
  const id = normalizeOreId(value);
  return id ? ORE_CATALOG[id] : null;
}

export function oreItemFlag(item) {
  return item?.getFlag?.(MODULE_ID, "ore")
    ?? item?.flags?.[MODULE_ID]?.ore
    ?? item?._source?.flags?.[MODULE_ID]?.ore
    ?? null;
}

export function createOreItemSource(oreOrId, quantity = 1) {
  const ore = typeof oreOrId === "object" ? oreOrId : getOre(oreOrId);
  if (!ore) throw new Error("Unknown ore type.");
  const q = Math.max(1, Math.floor(Number(quantity) || 1));
  const description = `<p><strong>${ore.name}</strong></p><p>${ore.description}</p><p>Trade value in the Blingdenstone gathering economy: <strong>${ore.value} ${ore.denomination} per lb.</strong></p>`;
  return {
    name: ore.name,
    type: "loot",
    img: ore.img,
    system: {
      quantity: q,
      weight: { value: 1, units: "lb" },
      rarity: ore.rarity,
      price: { value: ore.value, denomination: ore.denomination },
      description: { value: description, chat: description }
    },
    flags: {
      [MODULE_ID]: {
        ore: { version: 1, oreId: ore.id, unitWeightLb: 1, sellValue: ore.value, denomination: ore.denomination }
      },
      world: {
        dicebox: { itemId: `blingdenstone-ore-${ore.id}`, category: "mining-resource", schemaVersion: 1 }
      }
    }
  };
}

export async function installOreItems() {
  if (!globalThis.game?.user?.isGM) return { created: 0, existing: 0, skipped: true };
  const all = Array.from(globalThis.game?.items?.values?.() ?? globalThis.game?.items ?? []);
  const created = [];
  let existing = 0;
  for (const oreId of ORE_ORDER) {
    const ore = ORE_CATALOG[oreId];
    const found = all.find(item => oreItemFlag(item)?.oreId === ore.id)
      ?? all.find(item => item?.flags?.world?.dicebox?.itemId === `blingdenstone-ore-${ore.id}`);
    if (found) { existing += 1; continue; }
    const source = createOreItemSource(ore, 1);
    const ItemClass = globalThis.game.items?.documentClass ?? globalThis.Item;
    const item = typeof ItemClass?.create === "function"
      ? await ItemClass.create(source, { renderSheet: false })
      : (await ItemClass.createDocuments([source]))?.[0];
    created.push(item);
    all.push(item);
  }
  return { created: created.length, existing, skipped: false };
}
