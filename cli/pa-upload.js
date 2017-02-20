#! /usr/bin/env node

const program = require("commander")
const {validate, success, readJsonFile} = require("./utils")
const {uploadLocales} = require("./actions")

program
  .option("--project-id <value>", "PhraseApp project ID", process.env.PHRASEAPP_PROJECT_ID)
  .option("--access-token <value>", "PhraseApp access token", process.env.PHRASEAPP_ACCESS_TOKEN)
  .parse(process.argv)

const {
  accessToken,
  projectId: projectID,
  args: [path],
} = program

validate(projectID, "Please provide PhraseApp project ID")
validate(accessToken, "Please provide PhraseApp access token")
validate(path, "Please provide path to content to upload")

const content = readJsonFile(path)

// Main
uploadLocales({projectID, accessToken, content})
  .then(() => {
    success(
      `Success! Locales are uploading. Check PhraseApp uploads view to ` +
      `see the results of your upload.`
    )
  })
