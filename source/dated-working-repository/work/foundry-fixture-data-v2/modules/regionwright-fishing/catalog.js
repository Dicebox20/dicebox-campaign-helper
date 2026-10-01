/*
 * Regionwright Fishing Biomes
 *
 * The environment keys follow the official 2024 travel-terrain list, with
 * Underwater retained as an alias used by the 2014/Xanathar's encounter
 * tables. Fish and bait entries below are intentionally homebrew proposals;
 * only entries marked "official creature" borrow an official creature name.
 */

const FISH_ASSET_ROOT = "modules/regionwright/assets/fishing";

const freeze = value => Object.freeze(value);

function fish(id, name, image, options = {}) {
  return freeze({
    id,
    name,
    img: `${FISH_ASSET_ROOT}/${image}`,
    catchType: "ration",
    ration: 1,
    edibleEffect: "No mechanical effect; this catch counts as food when cooked.",
    purposes: ["downtime meal"],
    ...options
  });
}

function bait(id, name, options = {}) {
  return freeze({
    id,
    name,
    img: "icons/svg/fish.svg",
    description: "A mundane fishing bait proposed for the Regionwright fishing catalog.",
    purpose: "Improves the odds of a suitable catch in its listed environments.",
    ...options
  });
}

function biome(id, label, summary, fishEntries, baitIds, officialBasis) {
  return freeze({ id, label, summary, fish: freeze(fishEntries), baitIds: freeze(baitIds), officialBasis });
}

export const OFFICIAL_ENVIRONMENT_SOURCES = freeze({
  core2014: "https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes",
  xanathar: "https://www.dndbeyond.com/sources/dnd/xgte",
  core2024: "https://www.dndbeyond.com/sources/dnd/br-2024/dms-toolbox",
  fishingTackle: "https://www.dndbeyond.com/equipment/44-fishing-tackle",
  piranha: "https://www.dndbeyond.com/monsters/5195160-piranha",
  quipper: "https://www.dndbeyond.com/monsters/16989-quipper",
  reefShark: "https://www.dndbeyond.com/monsters/16994-reef-shark"
});

export const BAIT_CATALOG = freeze({
  worms: bait("worms", "Worms", { purpose: "Reliable freshwater bait." }),
  grubs: bait("grubs", "Grubs", { purpose: "Works in leaf litter, banks, and slow water." }),
  minnows: bait("minnows", "Live Minnows", { purpose: "Draws predatory freshwater fish." }),
  insects: bait("insects", "Crickets and Grasshoppers", { purpose: "A lightweight surface bait for warm freshwater." }),
  dough: bait("dough", "Bread Dough", { purpose: "Cheap bait for carp, bream, and urban water." }),
  cheese: bait("cheese", "Cheese Scraps", { purpose: "A strong-smelling bait for murky or fast water." }),
  "ice-minnows": bait("ice-minnows", "Ice Minnows", { purpose: "Cold-water bait that stays active under thin ice." }),
  "alpine-roe": bait("alpine-roe", "Salmon Roe", { purpose: "A compact, premium bait for mountain streams." }),
  stoneflies: bait("stoneflies", "Stonefly Nymphs", { purpose: "Natural bait for cold, clear mountain water." }),
  shrimp: bait("shrimp", "Shrimp", { purpose: "Versatile bait for coastal and underwater fishing." }),
  "squid-strips": bait("squid-strips", "Squid Strips", { purpose: "Durable saltwater bait for larger catches." }),
  chum: bait("chum", "Fish Chum", { purpose: "Attracts aggressive or opportunistic aquatic creatures." }),
  "oasis-grubs": bait("oasis-grubs", "Oasis Grubs", { purpose: "A scarce bait found near desert springs." }),
  "date-dough": bait("date-dough", "Date Dough", { purpose: "Sweet bait for warm-water fish." }),
  "beetle-larvae": bait("beetle-larvae", "Beetle Larvae", { purpose: "A hardy bait collected from dry soil and reeds." }),
  "crayfish-tail": bait("crayfish-tail", "Crayfish Tails", { purpose: "A meaty bait for pike and other ambush predators." }),
  leeches: bait("leeches", "Leeches", { purpose: "Strong bait for swamp and slow-moving water." }),
  frogs: bait("frogs", "Small Frogs", { purpose: "A risky but effective swamp bait." }),
  "carrion-chum": bait("carrion-chum", "Carrion Chum", { purpose: "Attracts scavengers; foul, noticeable, and dangerous." }),
  "glow-worms": bait("glow-worms", "Glowworms", { purpose: "Visible bait for dark water and cavern pools." }),
  "cave-grubs": bait("cave-grubs", "Cave Grubs", { purpose: "Blind-water bait gathered from damp stone." }),
  "fungus-bait": bait("fungus-bait", "Fungal Bait", { purpose: "A strange spore-scented bait for Underdark pools." }),
  scraps: bait("scraps", "Kitchen Scraps", { purpose: "Common bait around docks, mills, and settlements." }),
  "shiny-junk": bait("shiny-junk", "Shiny Junk", { purpose: "Improvised lure for curious fish in urban canals." })
});

export const FISHING_BIOMES = freeze({
  arctic: biome(
    "arctic",
    "Arctic",
    "Cold rivers, glacial lakes, and polar shores. Fishing is limited by ice and short thaw seasons.",
    [
      fish("arctic-char", "Arctic Char", "trout.svg"),
      fish("icefin", "Icefin", "bluegill.svg", { purposes: ["downtime meal", "cold-weather trade"] }),
      fish("coldwater-salmon", "Coldwater Salmon", "salmon.svg", { purposes: ["downtime meal", "smoked provisions"] })
    ],
    ["ice-minnows", "alpine-roe", "shiny-junk"],
    "Official 2024 travel terrain; the 2014 rules also use Arctic as favored terrain."
  ),
  coastal: biome(
    "coastal",
    "Coastal",
    "Shorelines, tidal pools, estuaries, and shallow reefs. The catch changes with tide and weather.",
    [
      fish("coastal-mackerel", "Coastal Mackerel", "bass.svg", { purposes: ["downtime meal", "smoked provisions"] }),
      fish("red-rockfish", "Red Rockfish", "bluegill.svg", { purposes: ["downtime meal", "dockside trade"] }),
      fish("reef-shark", "Reef Shark", "pike.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; treat as a dangerous rare catch.", purposes: ["shark teeth", "hide and oil", "trophy"], source: "official creature" })
    ],
    ["shrimp", "squid-strips", "chum"],
    "Official 2024 travel terrain and Xanathar's coastal encounter environment."
  ),
  desert: biome(
    "desert",
    "Desert",
    "Oases, wadis, irrigation channels, and rare underground springs are the only practical fishing sites.",
    [
      fish("oasis-carp", "Oasis Carp", "carp.svg", { purposes: ["downtime meal", "water-route trade"] }),
      fish("sunbaked-sunfish", "Sunbaked Sunfish", "bluegill.svg"),
      fish("dune-catfish", "Dune Catfish", "pike.svg", { purposes: ["downtime meal", "oil and leather scraps"] })
    ],
    ["oasis-grubs", "date-dough", "beetle-larvae"],
    "Official 2024 travel terrain and 2014/Xanathar's desert environment; fish require a water feature."
  ),
  forest: biome(
    "forest",
    "Forest",
    "Shaded streams, woodland ponds, and beaver pools favor small freshwater fish and patient casting.",
    [
      fish("brook-trout", "Brook Trout", "trout.svg"),
      fish("woodland-bass", "Woodland Bass", "bass.svg"),
      fish("leafscale-perch", "Leafscale Perch", "bluegill.svg", { purposes: ["downtime meal", "local trade"] })
    ],
    ["worms", "grubs", "minnows"],
    "Official 2024 travel terrain and 2014/Xanathar's forest environment."
  ),
  grassland: biome(
    "grassland",
    "Grassland",
    "Broad rivers, farm ponds, and seasonal creeks support easy, common catches near travel routes.",
    [
      fish("river-carp", "River Carp", "carp.svg"),
      fish("prairie-bluegill", "Prairie Bluegill", "bluegill.svg"),
      fish("channel-catfish", "Channel Catfish", "pike.svg", { purposes: ["downtime meal", "smoked provisions"] })
    ],
    ["insects", "dough", "minnows"],
    "Official 2024 travel terrain and 2014/Xanathar's grassland environment."
  ),
  hill: biome(
    "hill",
    "Hill",
    "Fast creeks, millponds, and rocky streams reward bait that stays on the hook.",
    [
      fish("creek-trout", "Creek Trout", "trout.svg"),
      fish("hill-pike", "Hill Pike", "pike.svg", { purposes: ["downtime meal", "hook and tooth components"] }),
      fish("stream-crayfish", "Stream Crayfish", "bluegill.svg", { catchType: "utility", ration: 0, edibleEffect: "Edible when cooked, but tracked as a utility catch in this module.", purposes: ["bait", "downtime meal", "trade"] })
    ],
    ["worms", "crayfish-tail", "cheese"],
    "Official 2024 travel terrain; Hill is also a standard encounter environment in Xanathar's."
  ),
  mountain: biome(
    "mountain",
    "Mountain",
    "Cold, clear alpine streams are difficult to reach but can yield premium trout and salmon.",
    [
      fish("mountain-trout", "Mountain Trout", "trout.svg"),
      fish("alpine-salmon", "Alpine Salmon", "salmon.svg", { purposes: ["downtime meal", "smoked provisions", "mountain trade"] }),
      fish("stoneback-char", "Stoneback Char", "bass.svg", { purposes: ["downtime meal", "cold-weather trade"] })
    ],
    ["stoneflies", "alpine-roe", "shiny-junk"],
    "Official 2024 travel terrain and 2014/Xanathar's mountain environment."
  ),
  swamp: biome(
    "swamp",
    "Swamp",
    "Warm, slow, murky water produces hearty fish and a higher chance of dangerous or foul catches.",
    [
      fish("blackwater-catfish", "Blackwater Catfish", "pike.svg", { purposes: ["downtime meal", "oil and leather scraps"] }),
      fish("marsh-gar", "Marsh Gar", "bass.svg", { purposes: ["downtime meal", "teeth and hide"] }),
      fish("piranha", "Piranha", "pike.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; use the catch for teeth, bait, or a dangerous specimen.", purposes: ["predator bait", "teeth", "trophy"], source: "official creature" }),
      fish("swamp-eel", "Swamp Eel", "trout.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; handle as a slippery material catch.", purposes: ["oil", "bait", "alchemical ingredient"] })
    ],
    ["leeches", "frogs", "carrion-chum"],
    "Official 2024 travel terrain and 2014/Xanathar's swamp environment; Piranha is an official Underwater creature that fits swamp water."
  ),
  underdark: biome(
    "underdark",
    "Underdark",
    "Blind subterranean lakes and rivers support pale fish, eels, and aggressive carnivores.",
    [
      fish("cavefish", "Cavefish", "bluegill.svg", { edibleEffect: "No mechanical effect; cook thoroughly before eating.", purposes: ["downtime meal", "cave settlement trade"] }),
      fish("blind-eel", "Blind Eel", "trout.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; useful as oil or bait.", purposes: ["oil", "bait", "alchemical ingredient"] }),
      fish("quipper", "Quipper", "pike.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; treat as a dangerous carnivorous catch.", purposes: ["predator bait", "teeth", "trophy"], source: "official creature" }),
      fish("glowbass", "Glowbass", "bass.svg", { edibleEffect: "No mechanical effect; cook thoroughly before eating.", purposes: ["downtime meal", "dim natural lure"] })
    ],
    ["glow-worms", "cave-grubs", "fungus-bait"],
    "Official 2024 travel terrain and 2014/Xanathar's Underdark environment; the official Quipper description specifically allows cold subterranean lakes."
  ),
  urban: biome(
    "urban",
    "Urban",
    "Canals, reservoirs, dockyards, and sewer outflows produce common catches with unpredictable quality.",
    [
      fish("canal-carp", "Canal Carp", "carp.svg"),
      fish("dockside-bream", "Dockside Bream", "bluegill.svg", { purposes: ["downtime meal", "street trade"] }),
      fish("sewer-eel", "Sewer Eel", "trout.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; contamination makes this a material catch.", purposes: ["oil", "bait", "evidence"] })
    ],
    ["dough", "cheese", "scraps", "shiny-junk"],
    "Official 2024 travel terrain and Xanathar's urban encounter environment."
  ),
  underwater: biome(
    "underwater",
    "Underwater",
    "Open water and submerged habitats support specialized catches; some are creatures rather than food fish.",
    [
      fish("sea-snapper", "Sea Snapper", "bass.svg", { purposes: ["downtime meal", "salted provisions"] }),
      fish("deepwater-tuna", "Deepwater Tuna", "salmon.svg", { purposes: ["downtime meal", "salted provisions", "trade"] }),
      fish("quipper-schooler", "Quipper Schooler", "pike.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; the catch represents a dangerous aquatic specimen.", purposes: ["predator bait", "teeth", "trophy"], source: "official creature" }),
      fish("reef-shark", "Reef Shark", "pike.svg", { catchType: "material", ration: 0, edibleEffect: "Not intended as a ration; treat as a dangerous rare catch.", purposes: ["shark teeth", "hide and oil", "trophy"], source: "official creature" })
    ],
    ["shrimp", "squid-strips", "chum"],
    "Official Xanathar's Underwater encounter environment; 2024 travel rules use Waterborne for travel across water."
  )
});

export const BIOME_ALIASES = freeze({ waterborne: "underwater", water: "underwater", aquatic: "underwater" });
export const BIOME_ORDER = freeze(Object.keys(FISHING_BIOMES));

export function normalizeBiomeId(value) {
  const key = String(value ?? "").trim().toLocaleLowerCase().replaceAll(" ", "-");
  return BIOME_ALIASES[key] ?? key;
}

export function getFishingBiome(value) {
  return FISHING_BIOMES[normalizeBiomeId(value)] ?? null;
}

export function getBiomeBait(biomeDefinition, value = null) {
  const biomeData = typeof biomeDefinition === "string" ? getFishingBiome(biomeDefinition) : biomeDefinition;
  if (!biomeData) return null;
  const requested = String(value ?? "").trim();
  const baitId = requested && biomeData.baitIds.includes(requested) ? requested : biomeData.baitIds[0];
  return BAIT_CATALOG[baitId] ?? null;
}

export function createBaitItemSource(baitDefinition, quantity = 1) {
  const baitData = typeof baitDefinition === "string" ? BAIT_CATALOG[baitDefinition] : baitDefinition;
  if (!baitData) throw new Error("Choose a bait from the fishing catalog.");
  const description = `<p><strong>${baitData.name}</strong></p><p>${baitData.description}</p><p>${baitData.purpose}</p>`;
  return {
    name: baitData.name,
    type: "loot",
    img: baitData.img,
    system: {
      quantity: Math.max(1, Math.floor(Number(quantity) || 1)),
      weight: { value: 0, units: "lb" },
      description: { value: description, chat: description },
      price: { value: 0, denomination: "gp" }
    },
    flags: {
      "regionwright-fishing": {
        bait: { version: 1, baitId: baitData.id }
      }
    }
  };
}
