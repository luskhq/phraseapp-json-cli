const { green } = require("chalk");
const { createCommand, validate, readJsonFile } = require("../utils");
const { uploadLocales } = require("../actions");

const upload = createCommand((args, options, logger) => {
  const { path } = args;
  const { projectId: projectID, accessToken } = options;

  validate(projectID, "Please provide PhraseApp project ID");
  validate(accessToken, "Please provide PhraseApp access token");
  validate(path, "Please provide path to content to upload");

  const content = readJsonFile(path);

  uploadLocales({ projectID, accessToken, content }).then(() => {
    logger.info(
      green(
        `Success! Locales are uploading. Check PhraseApp uploads view to ` +
          `see the results of your upload.`
      )
    );
  });
});

module.exports = upload;
