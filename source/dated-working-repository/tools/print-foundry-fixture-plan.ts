import { createFoundryFixturePlan } from "@dicebox/core";

const plan = createFoundryFixturePlan();
process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
