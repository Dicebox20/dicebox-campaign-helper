import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createTramRoutingFixturePlan } from "../packages/dicebox-compiler/src/tram-routing-fixture-plan.js";

const output = resolve("packages/dicebox-foundry/tram-routing-fixture-package.json");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(createTramRoutingFixturePlan(), null, 2)}\n`, "utf8");
console.log(JSON.stringify({ operation: "tram-routing.fixture.package", status: "STATIC_REVIEW", output, noWrite: true }));
