const chalk = require("chalk");
const fetch = require("node-fetch");
const fs = require("fs");
const fsPath = require("fs-path");
const path = require("path");
const R = require("ramda");

const createCommand = cb => (args, options, logger) => {
  try {
    cb(args, options, logger);
  } catch (error) {
    logger.error(`${chalk.red(`Failed. ${error.message}`)}\n`);
    logger.debug(error);
    process.exit(1);
  }
};

const validate = (value, message) => {
  if (R.not(value) || R.isEmpty(value)) {
    throw Error(`\n${message}\nPass "-h" to this script for help.\n`);
  }
};

const toArray = s =>
  s ? R.pipe(R.split(","), R.map(R.trim), R.filter(Boolean))(s) : [];

const readJsonFile = filePath => {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(filePath), { encoding: "utf8" })
    );
  } catch (error) {
    throw Error(
      `\nSorry, can't read or parse supplied JSON file.` +
        `\nError: ${error.message}\n`
    );
  }
};

const writeFile = (path, file) =>
  fsPath.writeFileSync(path, JSON.stringify(file, null, 2));

const fetchJSON = (url, options) =>
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(response);
    })
    .catch(error => {
      throw Error(
        `\nSorry, couldn't perform request.` +
          `\nError: ${error.statusText} (${error.status}) ${error.url}\n`
      );
    });

module.exports = {
  validate,
  toArray,
  readJsonFile,
  writeFile,
  fetchJSON,
  createCommand,
};
