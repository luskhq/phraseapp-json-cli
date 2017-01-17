const {downloadLocales} = require("./phraseapp")
const {validate, success, writeFile} = require("./utils")

const download = (options) => {
  const {
    accessToken,
    content,
    defaultLocale: defaultLocaleCode,
    projectId: projectID,
  } = options

  validate(projectID, "Please provide PhraseApp project ID")
  validate(accessToken, "Please provide PhraseApp access token")
  validate(defaultLocaleCode, "Please provide default locale")
  validate(content, "Please provide path to which content should be downloaded")

  downloadLocales({projectID, accessToken, defaultLocaleCode})
    .then((remoteContent) => {
      writeFile(content, remoteContent)
      success(`Success! Content downloaded to "${content}".`)
    })
}

const registerDownloadCommand = (program) => {
  program
    .command("download")
    .description(
      "Download all PhraseApp translations for all available languages"
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
      "relative path to where content should be downloaded"
    )
    .action(download)
}

module.exports = registerDownloadCommand
