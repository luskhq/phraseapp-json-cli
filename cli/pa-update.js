#! /usr/bin/env node

const program = require("commander")
const {validate, success, writeFile, readJsonFile} = require("./utils")
const {downloadLocales, updateContent} = require("./actions")
const {array} = require("dotenv-utils")

program
  .option("-p, --project-id <value>", "PhraseApp project ID", process.env.PHRASEAPP_PROJECT_ID)
  .option("-t, --access-token <value>", "PhraseApp access token", process.env.PHRASEAPP_ACCESS_TOKEN)
  .option("-d, --default-locale <value>", "default locale code to which empty keys should fall back to", process.env.PHRASEAPP_DEFAULT_LOCALE)
  .parse(process.argv)

const {
  accessToken,
  defaultLocale: defaultLocaleCode,
  args: [rawKeys, rawLangs, path],
  projectId: projectID
} = program

const keys = array(rawKeys)
const langs = array(rawLangs)

validate(projectID, "Please provide PhraseApp project ID")
validate(accessToken, "Please provide PhraseApp access token")
validate(defaultLocaleCode, "Please provide PhraseApp default locale")
validate(path, "Please provide path to content to update")
validate(keys.length > 0, "Please provide at least one key to update.")
validate(langs.length > 0, "Please provide at least one language for which keys should be updated.")

const localContent = readJsonFile(path)

// Main
downloadLocales({projectID, accessToken, defaultLocaleCode, langs})
  .then((remoteContent) => {
    const updatedContent = updateContent(langs, keys, localContent, remoteContent)
    writeFile(path, updatedContent)
    success(`Success! Content updated in "${path}".`)
  })
