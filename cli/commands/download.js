const { green } = require("chalk");
const { createCommand, validate, writeFile } = require("../utils");
const { downloadLocales } = require("../actions");

const download = createCommand((args, options, logger) => {
  const { path } = args;
  const {
    projectId: projectID,
    accessToken,
    defaultLocale: defaultLocaleCode,
  } = options;

  validate(projectID, "Please provide PhraseApp project ID");
  validate(accessToken, "Please provide PhraseApp access token");
  validate(path, "Please provide path to which content should be downloaded");

  downloadLocales({
    projectID,
    accessToken,
    defaultLocaleCode,
  }).then(remoteContent => {
    writeFile(path, remoteContent);
    logger.info(green(`Success! Content downloaded to "${path}".`));
  });
});

module.exports = download;
