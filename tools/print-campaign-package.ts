import { createCurrentCampaignPackage } from "@dicebox/compiler";

process.stdout.write(`${JSON.stringify(createCurrentCampaignPackage(), null, 2)}\n`);
