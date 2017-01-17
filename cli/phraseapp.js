const R = require("ramda")
const pMap = require("p-map")
const {fetchJSON, validate} = require("./utils")
const {unflatten} = require("flat")

const listLocales = ({projectID, accessToken}) => {
  return fetchJSON(`https://api.phraseapp.com/v2/projects/${projectID}/locales?access_token=${accessToken}`)
}

const downloadLocale = ({projectID, accessToken, localeID, localeCode, defaultLocaleID}) => {
  const params = [
    `access_token=${accessToken}`,
    "file_format=simple_json",
    "include_empty_translations=true",
    `fallback_locale_id=${defaultLocaleID}`,
  ]

  return fetchJSON(`https://api.phraseapp.com/v2/projects/${projectID}/locales/${localeID}/download?${params.join("&")}`)
    .then((localeContent) => {
      return [localeCode, localeContent]
    })
}

const downloadLocales = ({projectID, accessToken, defaultLocaleCode, langs}) => {
  return listLocales({projectID, accessToken})
    .then((locales) => {
      const defaultLocale = R.find(
        R.propEq("code", defaultLocaleCode),
        locales
      )

      validate(
        defaultLocale,
        `Sorry, can't download locales because the supplied default locale ` +
        `"${defaultLocaleCode}" doesn't exist on remote content. ` +
        `Check your input for typos.`
      )

      const targetLocales = langs
        ? locales.filter((locale) => langs.includes(locale.code))
        : locales

      return pMap(
        targetLocales,
        (locale) => {
          return downloadLocale({
            projectID,
            accessToken,
            localeID: locale.id,
            localeCode: locale.code,
            defaultLocaleID: defaultLocale.id
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
    .catch(console.error)
}

module.exports = {downloadLocales}
