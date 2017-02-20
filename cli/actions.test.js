const test = require("ava")
const {updateContent} = require("./actions")

const localContent = {
  en: {page: {title: "Title", body: "Content..."}, nav: {home: "Home", contacts: "Contacts"}},
  cs: {page: {title: "Nadpis", body: "Obsah..."}, nav: {home: "Domu", contacts: "Kontakty"}},
}

test("empty keys", (t) => {
  const languages = ["en"]
  const keys = []
  const remoteContent = {
    en: {
      page: {headline: "Headline", title: "Title"},
    },
  }
  const expected = localContent
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})

test("empty languages", (t) => {
  const languages = []
  const keys = ["page"]
  const remoteContent = {
    en: {
      page: {headline: "Headline", title: "Title"},
    },
  }
  const expected = localContent
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})

test("non existing key", (t) => {
  const languages = ["en"]
  const keys = ["about"]
  const localContent = {}
  const remoteContent = {
    en: {
      page: {headline: "Home headline", title: "Home Title"}
    },
  }
  t.throws(() => updateContent(languages, keys, localContent, remoteContent))
})

test("non existing language", (t) => {
  const languages = ["hu"]
  const keys = ["about"]
  const localContent = {}
  const remoteContent = {
    en: {
      page: {headline: "Home headline", title: "Home Title"},
    },
  }
  t.throws(() => updateContent(languages, keys, localContent, remoteContent))
})

test("empty local content, one language, existing keys", (t) => {
  const languages = ["en"]
  const keys = ["page", "nav"]
  const localContent = {}
  const remoteContent = {
    en: {
      page: {headline: "Home headline", title: "Home Title"},
      about: {headline: "About Headline", title: "About Title"},
      nav: {home: "Home", contacts: "Contacts"},
    },
  }
  const expected = {
    en: {
      page: {headline: "Home headline", title: "Home Title"},
      nav: {home: "Home", contacts: "Contacts"},
    },
  }
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})

test("non empty local content, multiple languages, multiple keys", (t) => {
  const languages = ["en", "cs"]
  const keys = ["page", "nav"]
  const localContent = {
    en: {
      page: {title: "Title", body: "Content..."},
      nav: {home: "Home", contacts: "Contacts"},
      footer: {privacyPolicy: "Privacy policy"},
    },
    cs: {
      page: {title: "Nadpis", body: "Obsah..."},
      nav: {home: "Domu", contacts: "Kontakty"},
      footer: {privacyPolicy: "Podmínky služeb"},
    },
    es: {
      page: {title: "Es title", body: "Es content"},
    },
  }
  const remoteContent = {
    en: {
      page: {title: "New title", body: "New content..."},
      nav: {home: "New home"},
      footer: {privacyPolicy: "New Privacy policy"},
    },
    cs: {
      page: {title: "Nový nadpis", body: "Nový obsah..."},
      nav: {home: "O nás", contacts: "Kontakt"},
      footer: {privacyPolicy: "Nové podmínky služeb"},
    },
  }
  const expected = {
    en: {
      page: {title: "New title", body: "New content..."},
      nav: {home: "New home"},
      footer: {privacyPolicy: "Privacy policy"},
    },
    cs: {
      page: {title: "Nový nadpis", body: "Nový obsah..."},
      nav: {home: "O nás", contacts: "Kontakt"},
      footer: {privacyPolicy: "Podmínky služeb"},
    },
    es: {
      page: {title: "Es title", body: "Es content"},
    },
  }
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})
