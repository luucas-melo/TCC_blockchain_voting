const fs = require("fs");
const path = require("path");

// read destination directory submitted as first param
const destination = process.argv.slice(2)[0];

// read all contract artifacts from artifacts.json which should be in the directoy from where script should be executed
const artifactContent = fs.readFileSync("./artifacts.json", "utf-8");

const artifacts: string[] = JSON.parse(artifactContent);

(async function gen() {
  /* eslint-disable no-restricted-syntax -- ignore */
  for (const artifact of artifacts) {
    let content;

    try {
      // try to import from node_modules
      // eslint-disable-next-line no-await-in-loop -- ignore
      content = JSON.stringify(await import(artifact));
    } catch (e) {
      // try to read as path on disc
      content = fs.readFileSync(artifact, "utf-8");
    }

    const filename = path.basename(artifact, ".json");
    // create and write typescript file
    fs.writeFileSync(
      path.join(destination, `${filename}.ts`),
      `export const ${filename}Artifact = ${content.trimEnd()} as const;`
    );
  }
  /* eslint-enable no-restricted-syntax */
})();
