const FormData = require("form-data")
const {fetchJSON} = require("./utils")

const listLocales = (options) => {
  const {accessToken, projectID} = options
  return fetchJSON(`https://${accessToken}:@api.phraseapp.com/v2/projects/${projectID}/locales`)
}

const downloadLocale = (options) => {
  const {
    accessToken,
    projectID,
    localeID,
    localeCode,
    defaultLocaleID
  } = options

  const params = [
    "file_format=simple_json",
    "include_empty_translations=true",
  ]
  .concat(defaultLocaleID ? [`fallback_locale_id=${defaultLocaleID}`] : [])
  .join("&")

  return fetchJSON(`https://${accessToken}:@api.phraseapp.com/v2/projects/${projectID}/locales/${localeID}/download?${params}`)
    .then((localeContent) => {
      return [localeCode, localeContent]
    })
}

const uploadLocale = (options) => {
  const {projectID, accessToken, localeCode, localeContent} = options

  const form = new FormData()
  form.append("file", localeContent, `${localeCode}.json`)
  form.append("file_format", "simple_json")
  form.append("locale_id", localeCode)
  form.append("update_translations", "true")

  return fetchJSON(
    `https://${accessToken}:@api.phraseapp.com/v2/projects/${projectID}/uploads`,
    {method: "POST", body: form}
  )
}

module.exports = {listLocales, downloadLocale, uploadLocale}
