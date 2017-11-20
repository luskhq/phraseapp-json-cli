const { green } = require("chalk");
const {
  createCommand,
  validate,
  writeFile,
  readJsonFile,
  toArray,
} = require("../utils");
const { downloadLocales, updateContent } = require("../actions");

const update = createCommand((args, options, logger) => {
  logger.debug("update command");
  logger.debug("OPTIONS");
  logger.debug(options);
  logger.debug("ARGUMENTS");
  logger.debug(args);

  const { path, langs: rawLangs, keys: rawKeys } = args;
  const {
    projectId: projectID,
    accessToken,
  } = options;

  const keys = toArray(rawKeys);
  const langs = toArray(rawLangs);

  validate(projectID, "Please provide PhraseApp project ID");
  validate(accessToken, "Please provide PhraseApp access token");
  validate(path, "Please provide path to content to update");
  validate(keys.length > 0, "Please provide at least one key to update.");
  validate(
    langs.length > 0,
    "Please provide at least one language for which keys should be updated."
  );

  const localContent = readJsonFile(path);

  downloadLocales({
    projectID,
    accessToken,
    defaultLocaleCode: null,
    langs,
  }).then(remoteContent => {
    const updatedContent = updateContent(
      langs,
      keys,
      localContent,
      remoteContent
    );
    writeFile(path, updatedContent);
    logger.info(green(`Success! Content updated in "${path}".`));
  });
});

module.exports = update;
