#! /usr/bin/env node

const program = require("commander")
const {downloadLocales} = require("./actions")
const {validate, success, writeFile} = require("./utils")

program
  .option("--project-id <value>", "PhraseApp project ID", process.env.PHRASEAPP_PROJECT_ID)
  .option("--access-token <value>", "PhraseApp access token", process.env.PHRASEAPP_ACCESS_TOKEN)
  .option("--default-locale <value>", "default locale code to which empty keys should fall back to", process.env.PHRASEAPP_DEFAULT_LOCALE)
  .parse(process.argv)

const {
  accessToken,
  defaultLocale: defaultLocaleCode,
  projectId: projectID,
  args: [path]
} = program

validate(projectID, "Please provide PhraseApp project ID")
validate(accessToken, "Please provide PhraseApp access token")
validate(defaultLocaleCode, "Please provide default locale")
validate(path, "Please provide path to which content should be downloaded")

downloadLocales({projectID, accessToken, defaultLocaleCode})
  .then((remoteContent) => {
    writeFile(path, remoteContent)
    success(`Success! Content downloaded to "${path}".`)
  })
