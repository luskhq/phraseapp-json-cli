const chalk = require("chalk");
const utils = require("../utils");
const actions = require("../actions");

const download = utils.createCommand(async (args, options, logger) => {
  const { path } = args;
  const {
    projectId,
    accessToken,
    fallbackLocale: fallbackLocaleCode,
  } = options;

  logger.info("Starting download...");
  const remoteContent = await actions.downloadLocales(
    { projectId, accessToken, fallbackLocaleCode },
    logger,
  );

  utils.writeFile(path, remoteContent);
  logger.info(chalk.green(`Success! Content downloaded to "${path}".`));
});

module.exports = download;
