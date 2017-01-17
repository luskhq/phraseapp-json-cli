const R = require("ramda")
const {validate, success, writeFile, readJsonFile} = require("./utils")
const {downloadLocales} = require("./phraseapp")
const parseEnvString = require("dotenv-utils")

// Transforms

const makeContentReducer = (remoteContent) => (contentAcc, path) => {
  const value = R.path(path, remoteContent)
  validate(
    value,
    `Sorry, can't update "${path[1]}" key for "${path[0]}" language because ` +
    `it doesn't exist on remote content. Check your input for typos.`
  )
  return R.assocPath(path, value, contentAcc)
}

const updateContent = (langs, keys, content, remoteContent) => {
  const paths = R.xprod(langs, keys)
  return R.reduce(makeContentReducer(remoteContent), content, paths)
}

// Command Handler

const update = (options) => {
  const {
    accessToken,
    content,
    defaultLocale: defaultLocaleCode,
    keys,
    langs,
    projectId: projectID,
  } = options

  validate(projectId, "Please provide PhraseApp project ID")
  validate(accessToken, "Please provide PhraseApp access token")
  validate(defaultLocaleCode, "Please provide PhraseApp default locale")
  validate(content, "Please provide path to content to update")
  validate(keys, "Please provide at least one key to update.")
  validate(langs, "Please provide at least one language for which keys should be updated.")

  const localContent = readJsonFile(content)

  downloadLocales({projectID, accessToken, defaultLocaleCode, langs})
    .then((remoteContent) => {
      const updatedContent = updateContent(langs, keys, localContent, remoteContent)
      writeFile(content, updatedContent)
      success(`Success! Content updated in "${content}".`)
    })
}

// CLI Registerer

const registerUpdateCommand = (program) => {
  program
    .command("update")
    .description(
      "Update keys for given languages"
    )
    .option(
      "-p, --project-id <value>",
      "PhraseApp project ID",
      process.env.PHRASEAPP_PROJECT_ID
    )
    .option(
      "-t, --access-token <value>",
      "PhraseApp access token",
      process.env.PHRASEAPP_ACCESS_TOKEN
    )
    .option(
      "-d, --default-locale <value>",
      "default locale code to which empty keys should fall back to",
      process.env.PHRASEAPP_DEFAULT_LOCALE
    )
    .option(
      "-c, --content <path>",
      "relative path to current content which should be updated"
    )
    .option(
      "-k, --keys <list>",
      "comma-separated list of keys to update",
      parseEnvString.array
    )
    .option(
      "-l, --langs <list>",
      "comma-separated list of languages for which keys should be updated",
      parseEnvString.array
    )
    .action(update)
}

module.exports = registerUpdateCommand
module.exports.updateContent = updateContent
