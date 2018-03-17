const R = require("ramda");
const pMap = require("p-map");
const emoji = require("node-emoji");
const flat = require("flat");
const utils = require("./utils");
const api = require("./phraseapp-api");

// Transforms
const makeContentReducer = remoteContent => (contentAcc, path) => {
  const value = R.path(path, remoteContent);
  utils.validate(
    value,
    `Sorry, can't update "${path[1]}" key for "${path[0]}" language because ` +
      `it doesn't exist on remote content. Check your input for typos.`,
  );
  return R.assocPath(path, value, contentAcc);
};

const updateContent = (langs, keys, content, remoteContent) => {
  const paths = R.xprod(langs, keys);
  return R.reduce(makeContentReducer(remoteContent), content, paths);
};

const serializeLocale = R.compose(
  JSON.stringify,
  R.map(emoji.unemojify),
  flat.flatten,
);

const deserializeLocale = R.compose(flat.unflatten, R.map(emoji.emojify));

const downloadLocales = async (options, logger) => {
  const { projectId, accessToken, fallbackLocaleCode, langs } = options;

  logger.debug("Getting locales...");
  const locales = await api.listLocales({ projectId, accessToken });

  const fallbackLocale = R.find(R.propEq("code", fallbackLocaleCode), locales);

  if (fallbackLocaleCode) {
    utils.validate(
      fallbackLocale,
      `Sorry, can't download locales because the supplied default locale ` +
        `"${fallbackLocaleCode}" doesn't exist on remote content. ` +
        `Check your input for typos.`,
    );
  }

  const targetLocales = langs
    ? locales.filter(locale => langs.includes(locale.code))
    : locales;

  const responses = await pMap(
    targetLocales,
    locale => {
      logger.debug(`Downloading '${locale.code}' locale`);

      return api.downloadLocale({
        projectId,
        accessToken,
        localeId: locale.id,
        localeCode: locale.code,
        fallbackLocaleId: fallbackLocale ? fallbackLocale.id : null,
      });
    },
    { concurrency: 2 },
  );

  return R.reduce(
    (acc, [localeCode, localeContent]) => {
      return R.assoc(localeCode, deserializeLocale(localeContent), acc);
    },
    {},
    responses,
  );
};

const uploadLocales = ({ projectId, accessToken, content }, logger) => {
  const locales = R.toPairs(content);

  return pMap(
    locales,
    ([localeCode, nestedLocaleContent]) => {
      const localeContent = serializeLocale(nestedLocaleContent);
      logger.debug(`Uploading '${localeCode}' locale`);

      return api.uploadLocale({
        projectId,
        accessToken,
        localeCode,
        localeContent,
      });
    },
    { concurrency: 2 },
  );
};

module.exports = { downloadLocales, uploadLocales, updateContent };
