#! /usr/bin/env node

require("dotenv").config()

const program = require("commander")
const chalk = require("chalk")
const fsPath = require("fs-path")
const du = require("dotenv-utils")
const R = require("ramda")
const {fetchContent} = require("./phraseApp")
const pckg = require("../package.json")
const {validate, success, readJsonFile, getContentName} = require("./utils")
const {updateContent} = require("./updateContent")

const update = ({output = getContentName(), projectId, accessToken, defaultLocale, keys, langs, content}) => {
  validate(projectId, "Please provide PhraseApp project ID")
  validate(accessToken, "Please provide PhraseApp access token")
  validate(defaultLocale, "Please provide default locale")
  validate(keys, "Please provide at least one key to update.")
  validate(langs, "Please provide at least one language for which keys should be updated.")

  const localContent = content ? readJsonFile(content) : {}

  const localeFilter = (locale) => langs.includes(locale.code)
  fetchContent(projectId, accessToken, defaultLocale, localeFilter)
    .then((remoteContent) => {
      const updatedContent = updateContent(langs, keys, localContent, remoteContent)
      fsPath.writeFile(output, JSON.stringify(updatedContent, null, 2))
      success(`Success! Content written to "${output}".`)
    }, (error) => {
      throw chalk.red(`${error}\nCouldn't fetch remote content`)
    })
}

const download = ({output = getContentName(), projectId, accessToken, defaultLocale}) => {
  validate(projectId, "Please provide PhraseApp project ID")
  validate(accessToken, "Please provide PhraseApp access token")
  validate(defaultLocale, "Please provide default locale")

  fetchContent(projectId, accessToken, defaultLocale)
    .then((remoteContent) => {
      fsPath.writeFile(output, JSON.stringify(remoteContent, null, 2))
      success(`Success! Content written to "${output}".`)
    }, (error) => {
      throw chalk.red(`${error}\nCouldn't fetch remote content`)
    })
}

program
  .version(pckg.version)
  .option("-o, --output <path>", "relative path to which new content should be written", process.env.OUTPUT)
  .option("-p, --project-id <value>", "PhraseApp project ID", process.env.PHRASEAPP_PROJECT_ID)
  .option("-t, --access-token <value>", "PhraseApp access token", process.env.PHRASEAPP_ACCESS_TOKEN)
  .option("-d, --default-locale <value>", "default locale code to which empty keys should fall back to", process.env.DEFAULT_LOCALE)

program
  .command("update")
  .description("Update keys for given languages")
  .option("-k, --keys <list>", "comma-separated list of keys to update", du.array)
  .option("-l, --langs <list>", "comma-separated list of languages for which keys should be updated", du.array)
  .option("-c, --content <path>", "relative path to current content", process.env.CONTENT)
  .action((options) => {
    update(R.merge(program, options))
  })

program
  .command("download")
  .description("Download all PhraseApp translations")
  .action(() => {
    download(program)
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
