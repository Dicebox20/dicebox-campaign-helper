import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createCurrentCampaignPackage } from "@dicebox/compiler";

const output = resolve("packages", "dicebox-foundry", "ascendancy-campaign-package.json");
const packageData = createCurrentCampaignPackage();

await writeFile(output, `${JSON.stringify(packageData, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ operation: "campaign-package.compile", status: "WRITTEN", output, assetStatuses: packageData.assets.bound.map(({ assetId, status, path }) => ({ assetId, status, path })) })}\n`);
