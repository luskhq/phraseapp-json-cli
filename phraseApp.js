const pMap = require('p-map')
const fetch = require("node-fetch")
const {unflatten} = require("flat")
const R = require("ramda")

const listLocales = (projectID, accessToken) => {
  return fetch(`https://api.phraseapp.com/v2/projects/${projectID}/locales?access_token=${accessToken}`)
    .then((res) => {
      return res.json()
    })
}

const downloadLocale = (projectID, accessToken, localeID, localeCode, defaultLocaleID) => {
  const params = [
    `access_token=${accessToken}`,
    "file_format=simple_json",
    "include_empty_translations=true",
    `fallback_locale_id=${defaultLocaleID}`,
  ]
  return fetch(`https://api.phraseapp.com/v2/projects/${projectID}/locales/${localeID}/download?${params.join("&")}`)
    .then((res) => {
      return res.json()
    })
    .then((localeContent) => {
      return [localeCode, localeContent]
    })
}

const fetchContent = (projectID, accessToken, defaultLocale, localeFilter = R.always(true)) => {
  return listLocales(projectID, accessToken)
    .then((locales) => {
      const defaultLocaleID = locales.find((locale) => locale.code === defaultLocale).id
      return pMap(locales.filter(localeFilter), (locale) => {
        return downloadLocale(projectID, accessToken, locale.id, locale.code, defaultLocaleID)
      }, {concurrency: 2})
    })
    .then((responses) => {
      return responses.reduce((acc, [localeCode, localeContent]) => {
        acc[localeCode] = unflatten(localeContent)
        return acc
      }, {})
    })
}

module.exports = {fetchContent}
