const R = require("ramda");
const program = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const du = require("dotenv-utils")

// Utils

const invariant = (truthy, message) => {
  if (!truthy) {
    throw chalk.red(`${message}\nPass "-h" to this script for help.`)
  }
}

const success = (message) => console.log(chalk.green(message))

const getContentName = () => `content-${new Date().toISOString()}.json`

const readJsonFile = (filePath) => JSON.parse(
  fs.readFileSync(path.resolve(filePath), {encording: "utf8"})
)


// Data processing

const updateContent = (langs, keys, content, remoteContent) => {
  const paths = R.xprod(langs, keys)

  const updatedContent =  R.reduce(
    (contentAcc, path) => R.set(
      R.lensPath(path),
      R.path(path, remoteContent),
      contentAcc
    ),
    content,
    paths
  )

  return updatedContent
}


// Data fetching

// Use concurrency-limited data fetching with p-map and fetch

const fetchContent = () => ({
  "en": {
    "page:index": {
      "title": "New Title",
      "body": "New Content..."
    }
  },
  "cs": {
    "page:index": {
      "title": "Novy nadpis",
      "body": "Novy obsah..."
    }
  }
}
)


// CLI

// PhraseApp keys/ids should be loaded either through CLI, from inline env,
// or .env

// Some top-level option similar to the "all" option would probably be handy.
// I am thinking just `option('-a, --all')`, which simply fetches remote content
// and writes it `output`.

// Also, it would be good if this scrip was actually executable. Ei. it should
// add itself to `node_modules/.bin` so that it can be run from package.json
// scripts.

program
  .option("-k, --keys <list>", "comma-separated list of keys to update", du.array)
  .option("-l, --langs <list>", "comma-separated list of languages for which keys should be updated", du.array)
  .option("-c, --content <path>", "relative path to current content", readJsonFile)
  .option("-o, --output <path>", "relative path to which new content should be written")
  .parse(process.argv);

const main = ({keys, langs, content = {}, output = getContentName()}) => {
  invariant(keys, "Please provide at least one key to update.")
  invariant(langs, "Please provide at least one language for which keys should be updated.")

  const remoteContent = fetchContent()
  const updatedContent = updateContent(langs, keys, content, remoteContent)
  fs.writeFileSync(output, JSON.stringify(updatedContent, null, 2))
  success(`Success! Content written to "${output}".`)
}

// Do stuff!!

main(program)
