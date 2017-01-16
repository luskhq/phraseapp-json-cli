#! /usr/bin/env node

if (!process.env.NODE_ENV) {
  require("dotenv").config()
}

const program = require("commander")
const chalk = require("chalk")
const fs = require("fs")
const fsPath = require('fs-path')
const path = require("path")
const du = require("dotenv-utils")
const R = require("ramda")
const {fetchContent} = require("./phraseApp")

const invariant = (truthy, message) => {
  if (R.isNil(truthy) || R.isEmpty(truthy)) {
    throw chalk.red(`${message}\nPass "-h" to this script for help.`)
  }
}

const success = (message) => console.log(chalk.green(message))

const getContentName = () => `content-${new Date().toISOString().replace(/:/g, "-")}.json`

const readJsonFile = (filePath) => JSON.parse(
  fs.readFileSync(path.resolve(filePath), {encording: "utf8"})
)

const updateContent = (langs, keys, content, remoteContent) => {
  const paths = R.xprod(langs, keys)

  return R.reduce(
    (contentAcc, path) => {
      const value = R.path(path, remoteContent)
      if (!value) {
        throw new Error(`wrong key: ${path.join()}`)
      }
      return R.assocPath(
        path,
        value,
        contentAcc
      )
    },
    content,
    paths
  )
}

const logOptions = (options) => {
  console.log('output path: %s', options.output);
  console.log('PhraseApp project ID: %s', options.projectId);
  console.log('PhraseApp access token: %s', options.accessToken);
  console.log('default locale: %s', options.defaultLocale);
}

const update = ({output = getContentName(), projectId, accessToken, defaultLocale}, {keys, langs, content}) => {
  invariant(projectId, "Please provide PhraseApp project ID")
  invariant(accessToken, "Please provide PhraseApp access token")
  invariant(defaultLocale, "Please provide default locale")
  invariant(keys, "Please provide at least one key to update.")
  invariant(langs, "Please provide at least one language for which keys should be updated.")

  const localContent = content ? readJsonFile(content) : {}

  const localeFilter = (locale) => langs.includes(locale.code)
  fetchContent(projectId, accessToken, defaultLocale, localeFilter)
    .then((remoteContent) => {
      const updatedContent = updateContent(langs, keys, localContent, remoteContent)
      fsPath.writeFile(output, JSON.stringify(updatedContent, null, 2))
      success(`Success! Content written to "${output}".`)
    })
    .catch((error) => {
      throw chalk.red(`${error}\nCouldn't fetch remote content`)
    })
}

const download = ({output = getContentName(), projectId, accessToken, defaultLocale}) => {
  invariant(projectId, "Please provide PhraseApp project ID")
  invariant(accessToken, "Please provide PhraseApp access token")
  invariant(defaultLocale, "Please provide default locale")

  fetchContent(projectId, accessToken, defaultLocale)
    .then((remoteContent) => {
      fsPath.writeFile(output, JSON.stringify(remoteContent, null, 2))
      success(`Success! Content written to "${output}".`)
    })
    .catch((error) => {
      throw chalk.red(`${error}\nCouldn't fetch remote content`)
    })
}

program
  .version('0.0.1')
  .option("-o, --output <path>", "relative path to which new content should be written", process.env.OUTPUT)
  .option("-p, --project-id <value>", "PhraseApp project ID", process.env.PHRASEAPP_PROJECT_ID)
  .option("-t, --access-token <value>", "PhraseApp access token", process.env.PHRASEAPP_ACCESS_TOKEN)
  .option("-d, --default-locale <value>", "default locale", process.env.DEFAULT_LOCALE)

program
  .command('update')
  .description('update translations for given languages and keys')
  .option("-k, --keys <list>", "comma-separated list of keys to update", du.array, du.array(process.env.KEYS))
  .option("-l, --langs <list>", "comma-separated list of languages for which keys should be updated", du.array,
    du.array(process.env.LANGS))
  .option("-c, --content <path>", "relative path to current content", process.env.CONTENT)
  .action((options) => {
    console.log('languages:  %j', options.langs)
    console.log('keys:  %j', options.keys)
    console.log('content path: %s', options.content);
    logOptions(program)
    update(program, options)
  })

program
  .command('download')
  .description('download all PhraseApp translations')
  .action(() => {
    logOptions(program)
    download(program)
  })

program.parse(process.argv);

if (!program.args.length) {
  program.help()
}

module.exports = {updateContent}
