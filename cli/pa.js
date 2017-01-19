#! /usr/bin/env node

const program = require("commander")
const path = require("path")
const { version } = require("../package.json")

// Try to load env variables from .env file in current working directory
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") })

// Set up CLI
program
  .version(version)
  .command("download <path>", "Download all PhraseApp translations for all available languages to target path")
  .command("update <keys> <langs> <path>", "Update specified keys for given languages and save to target path")
  .command("upload <path>", "Upload specified content file to PhraseApp")
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
