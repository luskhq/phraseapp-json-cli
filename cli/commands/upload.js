const chalk = require("chalk");
const utils = require("../utils");
const actions = require("../actions");

const upload = utils.createCommand(async (args, options, logger) => {
  const { path } = args;
  const { projectId, accessToken } = options;

  const content = utils.readJsonFile(path);

  logger.info("Starting upload...");
  await actions.uploadLocales({ projectId, accessToken, content }, logger);

  // prettier-ignore
  logger.info(chalk.green("Success! Locales are uploading. Check PhraseApp uploads view to see the results of your upload."));
});

module.exports = upload;
