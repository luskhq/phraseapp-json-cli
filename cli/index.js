#! /usr/bin/env node

const cli = require("caporal");
const pkg = require("../package");
const download = require("./commands/download");
const update = require("./commands/update");
const upload = require("./commands/upload");

// prettier-ignore
cli
  .version(pkg.version)
  .description(pkg.description)

  .command("download", "Download all PhraseApp translations for all available languages and save to target path")
  .option("--project-id <value>", "PhraseApp project ID", null, process.env.PHRASEAPP_PROJECT_ID)
  .option("--access-token <value>", "PhraseApp access token", null, process.env.PHRASEAPP_ACCESS_TOKEN)
  .option("--default-locale <value>", "Default locale code to which empty keys should fall back to", null, process.env.PHRASEAPP_DEFAULT_LOCALE)
  .argument("[path]", "Target path", null, "content.json")
  .action(download)

  .command("update", "Update specified keys for given languages and save to target path")
  .option("--project-id <value>", "PhraseApp project ID", null, process.env.PHRASEAPP_PROJECT_ID)
  .option("--access-token <value>", "PhraseApp access token", null, process.env.PHRASEAPP_ACCESS_TOKEN)
  .option("--default-locale <value>", "Default locale code to which empty keys should fall back to", null, process.env.PHRASEAPP_DEFAULT_LOCALE)
  .argument('<keys>', 'PhraseApp keys to update')
  .argument('<langs>', 'Languages')
  .argument('[path]', 'Target path', null, "content.json")
  .action(update)

  .command("upload ", "Upload specified content file to PhraseApp")
  .option("--project-id <value>", "PhraseApp project ID", null, process.env.PHRASEAPP_PROJECT_ID)
  .option("--access-token <value>", "PhraseApp access token", null, process.env.PHRASEAPP_ACCESS_TOKEN)
  .argument('[path]', 'Source path', null, "content.json")
  .action(upload)

cli.parse(process.argv);
