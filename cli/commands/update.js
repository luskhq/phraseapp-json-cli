const chalk = require("chalk");
const utils = require("../utils");
const actions = require("../actions");

const update = utils.createCommand(async (args, options, logger) => {
  const { path, langs, keys } = args;
  const {
    projectId,
    accessToken,
    fallbackLocale: fallbackLocaleCode,
  } = options;

  const localContent = utils.readJsonFile(path);

  const remoteContent = await actions.downloadLocales(
    {
      projectId,
      accessToken,
      fallbackLocaleCode,
      langs,
    },
    logger,
  );

  const updatedContent = actions.updateContent(
    langs,
    keys,
    localContent,
    remoteContent,
  );

  utils.writeFile(path, updatedContent);
  logger.info(chalk.green(`Success! Content updated in "${path}".`));
});

module.exports = update;
