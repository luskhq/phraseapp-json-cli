#! /usr/bin/env node

const program = require("commander")
const path = require("path")
const package = require("../package.json")
const registerDownloadCommand = require("./download")
const registerUpdateCommand = require("./update")

// Try to load env variables from .env file in current working directory
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
})

// Set up CLI
program.version(package.version)
registerUpdateCommand(program)
registerDownloadCommand(program)
program.parse(process.argv)
