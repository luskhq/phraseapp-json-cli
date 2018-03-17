const FormData = require("form-data");
const { fetchJSON } = require("./utils");

const listLocales = options => {
  const { accessToken, projectId } = options;
  return fetchJSON(
    `https://${accessToken}:@api.phraseapp.com/v2/projects/${projectId}/locales`,
  );
};

const downloadLocale = async options => {
  const {
    accessToken,
    projectId,
    localeId,
    localeCode,
    fallbackLocaleId,
  } = options;

  // prettier-ignore
  const params = [
    "file_format=simple_json",
    ...(fallbackLocaleId
      ? [`fallback_locale_id=${fallbackLocaleId}`, `include_empty_translations=true`]
      : []),
  ].filter(Boolean).join("&");

  const localeContent = await fetchJSON(
    `https://${accessToken}:@api.phraseapp.com/v2/projects/${projectId}/locales/${localeId}/download?${params}`,
  );

  return [localeCode, localeContent];
};

const uploadLocale = options => {
  const { projectId, accessToken, localeCode, localeContent } = options;

  const form = new FormData();
  form.append("file", localeContent, `${localeCode}.json`);
  form.append("file_format", "simple_json");
  form.append("locale_id", localeCode);
  form.append("update_translations", "true");

  return fetchJSON(
    `https://${accessToken}:@api.phraseapp.com/v2/projects/${projectId}/uploads`,
    { method: "POST", body: form },
  );
};

module.exports = { listLocales, downloadLocale, uploadLocale };
