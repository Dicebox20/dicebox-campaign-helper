import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repository = (process.argv[2] ?? "").replace(/\/$/, "");
if (!/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(repository)) {
  throw new Error("Provide the final repository URL, for example https://github.com/OWNER/REPOSITORY");
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const editions = [
  { folder: "regionwright-free", manifest: "regionwright-puzzles-and-traps.json", archive: "regionwright-puzzles-and-traps" },
  { folder: "regionwright-premium", manifest: "regionwright-studio.json", archive: "regionwright-studio" }
];

for (const edition of editions) {
  const modulePath = path.join(root, "dist", edition.folder, "module.json");
  const module = JSON.parse(await readFile(modulePath, "utf8"));
  const versionTag = `v${module.version}`;
  const releaseManifest = {
    ...module,
    url: repository,
    manifest: `${repository}/releases/latest/download/${edition.manifest}`,
    download: `${repository}/releases/download/${versionTag}/${edition.archive}-${versionTag}.zip`,
    bugs: `${repository}/issues`,
    changelog: `${repository}/blob/main/CHANGELOG.md`
  };
  const serialized = `${JSON.stringify(releaseManifest, null, 2)}\n`;
  await writeFile(modulePath, serialized);
  await writeFile(path.join(root, "dist", edition.manifest), serialized);
}

console.log(`GitHub release manifests prepared for ${repository}`);
