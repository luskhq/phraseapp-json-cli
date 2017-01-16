const chalk = require("chalk")
const R = require("ramda")
const fs = require("fs")
const path = require("path")

const validate = (truthy, message) => {
  if (R.isNil(truthy) || R.isEmpty(truthy)) {
    throw chalk.red(`${message}\nPass "-h" to this script for help.`)
  }
}

const invariant = (truthy, message) => {
  if (!truthy) {
    throw chalk.red(`${message}\nPass "-h" to this script for help.`)
  }
}

const success = (message) => console.log(chalk.green(message))

const getContentName = () => `content-${new Date().toISOString().replace(/:/g, "-")}.json`

const readJsonFile = (filePath) => JSON.parse(
  fs.readFileSync(path.resolve(filePath), {encording: "utf8"})
)

module.exports = {validate, invariant, success, getContentName, readJsonFile}
