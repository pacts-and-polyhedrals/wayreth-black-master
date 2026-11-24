import fs from "node:fs";
import path from "node:path";

/**
 * Release preflight.
 *
 * Twice now a release has failed on the Forge with an opaque 500, and both
 * times the cause was the same shape of mistake: the manifest and the git tag
 * disagreed, so the `download` URL pointed at a release that did not exist.
 * GitHub answers that with a 404 and the Forge reports it as a server error,
 * which sends you looking in the wrong place.
 *
 *   npm run check:release          offline checks, then probe the live URLs
 *   npm run check:release -- --offline    skip the network
 *
 * Run it before publishing to see what the URLs must be, and again afterwards
 * to confirm the release actually serves them.
 */

const ROOT = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const errors = [];
const notes = [];
const { version, download, manifest: manifestUrl, id } = manifest;

if (pkg.version !== version) {
  errors.push(`package.json is ${pkg.version} but module.json is ${version}`);
}
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  errors.push(`version "${version}" is not three numbers`);
}

const tag = `v${version}`;
const expectedDownload = download?.replace(/\/releases\/download\/[^/]+\//,
  `/releases/download/${tag}/`);

if (!download?.includes(`/releases/download/${tag}/`)) {
  errors.push(`download URL does not point at tag ${tag}:\n      ${download}\n`
    + `      it should be ${expectedDownload}`);
}
if (!download?.endsWith("/module.zip")) {
  errors.push(`the download asset must be named module.zip, not ${download?.split("/").pop()}`);
}
if (!manifestUrl?.endsWith("/releases/latest/download/module.json")) {
  errors.push("the manifest URL should be the /releases/latest/download/module.json form, "
    + "so Foundry always sees the newest release");
}

notes.push(`Tag the release exactly    ${tag}`);
notes.push(`Attach, named exactly      module.zip  and  module.json`);
notes.push(`Mark it                    Latest release`);

async function probe(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    return response.status;
  } catch (error) {
    return `unreachable (${error.message})`;
  }
}

const offline = process.argv.includes("--offline");
let remote = null;
if (!offline) {
  const [zip, json, latestZip] = await Promise.all([
    probe(download),
    probe(manifestUrl),
    probe(download.replace(`/releases/download/${tag}/`, "/releases/latest/download/"))
  ]);
  remote = { zip, json, latestZip };
}

console.log(`\n${id} ${version}\n`);
for (const note of notes) console.log(`  ${note}`);

if (remote) {
  console.log(`\nLive URLs:`);
  console.log(`  ${remote.json === 200 ? "ok  " : "FAIL"}  manifest      ${manifestUrl} -> ${remote.json}`);
  console.log(`  ${remote.zip === 200 ? "ok  " : "FAIL"}  this version  ${download} -> ${remote.zip}`);

  if (remote.zip !== 200 && remote.latestZip === 200) {
    console.log(`\n  The latest release does serve a module.zip, but not under ${tag}.`);
    console.log(`  That is the mismatch: the published manifest says ${version}, so Foundry and`);
    console.log(`  the Forge ask for ${tag}, GitHub returns 404, and the Forge shows a 500.`);
    console.log(`  Create a release tagged ${tag} with both assets attached.`);
  } else if (remote.zip !== 200) {
    console.log(`\n  Nothing is published at ${tag} yet. That is expected before you release;`);
    console.log(`  run this again afterwards and it should read 200.`);
  }
}

if (errors.length) {
  console.error(`\nRelease preflight failed:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`\nManifest is internally consistent.\n`);
