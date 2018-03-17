const chalk = require("chalk");
const fetch = require("node-fetch");
const fs = require("fs");
const fsPath = require("fs-path");
const path = require("path");
const R = require("ramda");

const createCommand = cb => async (args, options, logger) => {
  try {
    logger.debug("Arguments:", args);
    logger.debug();
    logger.debug("Options:", options);
    logger.debug();

    await cb(args, options, logger);
  } catch (error) {
    logger.error(`${chalk.red(`Failed. ${error.message}`)}\n`);
    logger.debug(error);
    process.exit(1);
  }
};

const validate = (value, message) => {
  if (R.not(value) || R.isEmpty(value)) {
    throw new Error(`\n${message}\nPass "-h" to this script for help.\n`);
  }
};

const readJsonFile = filePath => {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(filePath), { encoding: "utf8" }),
    );
  } catch (error) {
    throw new Error(
      `\nSorry, can't read or parse supplied JSON file.` +
        `\nError: ${error.message}\n`,
    );
  }
};

const writeFile = (path, file) =>
  fsPath.writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`);

const fetchJSON = async (url, options) => {
  const response = await fetch(url, options);

  if (response.ok) {
    return await response.json();
  }

  const { statusText, status } = response;
  const body = await response.json();

  const errorMessage =
    `\nSorry, couldn't perform request. ${body.message}` +
    `\n\nError: ${statusText} (${status}) ${url}\n`;

  throw new Error(errorMessage);
};

module.exports = {
  validate,
  readJsonFile,
  writeFile,
  fetchJSON,
  createCommand,
};
