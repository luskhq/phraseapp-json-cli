const R = require("ramda")
const pMap = require("p-map")
const flatten = require("flat")
const {unflatten} = require("flat")
const {validate} = require("./utils")
const {listLocales, downloadLocale, uploadLocale} = require("./phraseapp-api")

// Transforms
const makeContentReducer = (remoteContent) => (contentAcc, path) => {
  const value = R.path(path, remoteContent)
  validate(
    value,
    `Sorry, can't update "${path[1]}" key for "${path[0]}" language because ` +
    `it doesn't exist on remote content. Check your input for typos.`
  )
  return R.assocPath(path, value, contentAcc)
}

const updateContent = (langs, keys, content, remoteContent) => {
  const paths = R.xprod(langs, keys)
  return R.reduce(makeContentReducer(remoteContent), content, paths)
}

const downloadLocales = (options) => {
  const {projectID, accessToken, defaultLocaleCode, langs} = options

  return listLocales({projectID, accessToken})
    .then((locales) => {
      let defaultLocaleId = null
      if (defaultLocaleCode) {
        const defaultLocale = R.find(R.propEq("code", defaultLocaleCode), locales)

        validate(
          defaultLocale,
          `Sorry, can't download locales because the supplied default locale ` +
          `"${defaultLocaleCode}" doesn't exist on remote content. ` +
          `Check your input for typos.`
        )

        defaultLocaleId = defaultLocale.id
      }

      const targetLocales = langs
        ? locales.filter(locale => langs.includes(locale.code))
        : locales

      return pMap(
        targetLocales,
        (locale) => {
          return downloadLocale({
            projectID,
            accessToken,
            localeID: locale.id,
            localeCode: locale.code,
            defaultLocaleID: defaultLocaleId
          })
        },
        {concurrency: 2}
      )
    })
    .then((responses) => {
      return R.reduce(
        (acc, [localeCode, localeContent]) => {
          return R.assoc(localeCode, unflatten(localeContent), acc)
        },
        {},
        responses
      )
    })
}

const uploadLocales = ({projectID, accessToken, content}) => {
  const locales = R.toPairs(content)

  return pMap(
    locales,
    ([localeCode, nestedLocaleContent]) => {
      const localeContent = JSON.stringify(flatten(nestedLocaleContent))
      return uploadLocale({
        projectID,
        accessToken,
        localeCode,
        localeContent
      })
    },
    {concurrency: 2}
  )
}

module.exports = {downloadLocales, uploadLocales, updateContent}
