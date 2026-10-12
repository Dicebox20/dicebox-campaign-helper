import { MODULE_ID, MINING_ORE_FLAG } from "./mining-engine.js";

const freeze = value => Object.freeze(value);

function ore(id, name, img, priceValue, denomination, options = {}) {
  return freeze({
    id,
    name,
    img,
    weight: 1,
    price: freeze({ value: priceValue, denomination }),
    ...options
  });
}

export const ORE_CATALOG = freeze({
  "iron-ore": ore(
    "iron-ore",
    "Iron Ore",
    "icons/commodities/stone/ore-chunk-iron-black.webp",
    1,
    "sp",
    {
      tier: "common",
      colorHint: "dark iron-black seams with rusty brown staining",
      description: "A one-pound chunk of raw iron-bearing ore from an Underdark vein. A practical, common mining resource in the stone around Blingdenstone."
    }
  ),
  "copper-ore": ore(
    "copper-ore",
    "Copper Ore",
    "icons/commodities/stone/ore-chunk-copper-orange.webp",
    5,
    "sp",
    {
      tier: "common",
      colorHint: "orange-red copper ore with green-blue oxidation",
      description: "A one-pound chunk of raw copper-bearing ore. Copper-bearing seams are a common, useful find in the caverns around Blingdenstone."
    }
  ),
  "silver-ore": ore(
    "silver-ore",
    "Silver Ore",
    "icons/commodities/stone/ore-chunk-silver-gray.webp",
    2,
    "gp",
    {
      tier: "uncommon",
      colorHint: "pale metallic silver veins in dark stone",
      description: "A one-pound chunk of silver-bearing raw ore. It still needs crushing, sorting, and smelting before it reaches refined silver value."
    }
  ),
  "gold-ore": ore(
    "gold-ore",
    "Gold Ore",
    "icons/commodities/stone/ore-chunk-yellow-gold.webp",
    10,
    "gp",
    {
      tier: "rare",
      colorHint: "warm yellow-gold flecks and narrow metallic veins",
      description: "A one-pound chunk of gold-bearing raw ore. The visible metal is valuable, but much of the mass is still host rock."
    }
  ),
  "mithral-ore": ore(
    "mithral-ore",
    "Mithral Ore",
    "icons/commodities/stone/ore-chunk-teal.webp",
    25,
    "gp",
    {
      tier: "very rare",
      colorHint: "pale blue-silver metallic veins with a cold sheen",
      description: "A one-pound chunk of rare mithral-bearing ore from the deep stone around Blingdenstone."
    }
  ),
  "adamantine-ore": ore(
    "adamantine-ore",
    "Adamantine Ore",
    "icons/commodities/stone/ore-chunk-black.webp",
    50,
    "gp",
    {
      tier: "very rare",
      colorHint: "dense black metallic stone with hard silvery facets",
      description: "A one-pound chunk of exceptionally hard adamantine-bearing ore. Exceptionally rare deposits can be found in the deepest mineral-bearing stone around Blingdenstone."
    }
  )
});

export const ORE_ORDER = freeze([
  "iron-ore",
  "copper-ore",
  "silver-ore",
  "gold-ore",
  "mithral-ore",
  "adamantine-ore"
]);

export function getOre(oreId) {
  return ORE_CATALOG[String(oreId ?? "").trim().toLowerCase()] ?? null;
}

export function formatOreValue(definition) {
  if (!definition) return "—";
  return `${definition.price.value} ${definition.price.denomination}`;
}

export function createOreItemSource(definitionOrId, quantity = 1) {
  const definition = typeof definitionOrId === "string" ? getOre(definitionOrId) : definitionOrId;
  if (!definition) throw new Error("Unknown mining ore.");
  const q = Math.max(1, Math.trunc(Number(quantity) || 1));
  const priceText = formatOreValue(definition);
  const description = [
    `<p><strong>${definition.name}</strong></p>`,
    `<p>${definition.description}</p>`,
    `<p><strong>Gathering unit:</strong> 1 lb. <strong>Sale value:</strong> ${priceText} per unit in the Blingdenstone gathering economy.</p>`
  ].join("");
  return {
    name: definition.name,
    type: "loot",
    img: definition.img,
    system: {
      quantity: q,
      weight: { value: definition.weight, units: "lb" },
      description: { value: description, chat: description },
      price: { value: definition.price.value, denomination: definition.price.denomination }
    },
    flags: {
      [MODULE_ID]: {
        [MINING_ORE_FLAG]: {
          version: 1,
          oreId: definition.id,
          unitWeight: definition.weight,
          saleValue: { ...definition.price },
          tier: definition.tier
        }
      }
    }
  };
}

export function createAllOreItemSources() {
  return ORE_ORDER.map(id => createOreItemSource(id, 1));
}
