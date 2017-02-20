const chalk = require("chalk")
const fetch = require("node-fetch")
const fs = require("fs")
const fsPath = require("fs-path")
const path = require("path")
const R = require("ramda")

const validate = (value, message) => {
  if (R.not(value) || R.isEmpty(value)) {
    throw chalk.red(`\n${message}\nPass "-h" to this script for help.\n`)
  }
}

// eslint-disable-next-line no-console
const success = (message) => console.log(chalk.green(message))

const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(filePath), {encoding: "utf8"}))
  } catch (error) {
    throw chalk.red(
      `\nSorry, can't read or parse supplied JSON file.` +
      `\nError: ${error.message}\n`
    )
  }
}

const writeFile = (path, file) => fsPath.writeFileSync(path, JSON.stringify(file, null, 2))

const fetchJSON = (url, options) => fetch(url, options)
  .then((response) => {
    if (response.ok) {
      return response.json()
    }

    return Promise.reject(response)
  })
  .catch((error) => {
    throw chalk.red(
      `\nSorry, couldn't perform request.` +
      `\nError: ${error.statusText} (${error.status}) ${error.url}\n`
    )
  })

module.exports = {validate, success, readJsonFile, writeFile, fetchJSON}
