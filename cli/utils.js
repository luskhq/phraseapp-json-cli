const chalk = require("chalk")
const R = require("ramda")
const fs = require("fs")
const path = require("path")
const fsPath = require("fs-path")
const fetch = require("node-fetch")

const validate = (value, message) => {
  if (R.not(value) || R.isEmpty(value)) {
    throw chalk.red(`\n${message}\nPass "-h" to this script for help.\n`)
  }
}

const success = (message) => console.log(chalk.green(message))

const readJsonFile = (filePath) =>
  JSON.parse(fs.readFileSync(path.resolve(filePath), {encording: "utf8"}))

const writeFile = (path, file) =>
  fsPath.writeFileSync(path, JSON.stringify(file, null, 2))

const fetchJSON = (url) =>
  fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      }

      return Promise.reject(response)
    })
    // Have to use separate catch in order to catch the Promise.reject above
    .catch((error) => {
      throw chalk.red(
        `\nSorry, couldn't fetch remote content.` +
        `\nError: ${error.statusText} (${error.status}) ${error.url}\n`
      )
    })

module.exports = {validate, success, readJsonFile, writeFile, fetchJSON}
