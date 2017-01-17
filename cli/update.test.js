const test = require('ava')
const {updateContent} = require("./update")

const localContent = {
  "en": {
    "page:index": {
      "title": "Title",
      "body": "Content..."
    },
    "nav": {
      "home": "Home",
      "contacts": "Contacts"
    }
  },
  "cs": {
    "page:index": {
      "title": "Nadpis",
      "body": "Obsah..."
    },
    "nav": {
      "home": "Domu",
      "contacts": "Kontakty",
    }
  }
}

test("empty keys", (t) => {
  const languages = ["en"]
  const keys = []
  const remoteContent = {
    "en": {
      "page:index": {
        "headline": "Headline",
        "title": "Title"
      }
    }
  }
  const expected = localContent
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})

test("empty languages", (t) => {
  const languages = []
  const keys = ["page:index"]
  const remoteContent = {
    "en": {
      "page:index": {
        "headline": "Headline",
        "title": "Title"
      }
    }
  }
  const expected = localContent
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})

test("non existing key", (t) => {
  const languages = ["en"]
  const keys = ["page:about"]
  const localContent = {}
  const remoteContent = {
    "en": {
      "page:index": {
        "headline": "Home headline",
        "title": "Home Title"
      }
    }
  }
  t.throws(() => updateContent(languages, keys, localContent, remoteContent))
})

test("non existing language", (t) => {
  const languages = ["hu"]
  const keys = ["page:about"]
  const localContent = {}
  const remoteContent = {
    "en": {
      "page:index": {
        "headline": "Home headline",
        "title": "Home Title"
      }
    }
  }
  t.throws(() => updateContent(languages, keys, localContent, remoteContent))
})

test("empty local content, one language, existing keys", (t) => {
  const languages = ["en"]
  const keys = ["page:index", "nav"]
  const localContent = {}
  const remoteContent = {
    "en": {
      "page:index": {
        "headline": "Home headline",
        "title": "Home Title"
      },
      "page:about": {
        "headline": "About Headline",
        "title": "About Title"
      },
      "nav": {
        "home": "Home",
        "contacts": "Contacts"
      }
    }
  }
  const expected = {
    "en": {
      "page:index": {
        "headline": "Home headline",
        "title": "Home Title"
      },
      "nav": {
        "home": "Home",
        "contacts": "Contacts"
      }
    }
  }
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})

test("non empty local content, multiple languages, multiple keys", (t) => {
  const languages = ["en", "pl", "es"]
  const keys = ["page:index", "nav"]
  const localContent = {
    "en": {
      "page:index": {
        "title": "Title",
        "body": "Content..."
      },
      "nav": {
        "home": "Home",
        "contacts": "Contacts"
      },
      "footer": {
        "privacyPolicy": "Privacy policy"
      }
    },
    "cs": {
      "page:index": {
        "title": "Nadpis",
        "body": "Obsah..."
      },
      "nav": {
        "home": "Domu",
        "contacts": "Kontakty",
      }
    },
    "es": {
      "nav": {
        "home": "Página Principal",
        "contacts": "Contacto",
      },
      "footer": {
        "privacyPolicy": "Política de Privacidad"
      }
    }
  }
  const remoteContent = {
    "en": {
      "page:index": {
        "title": "New title",
        "body": "New content..."
      },
      "nav": {
        "home": "New home",
      },
      "footer": {
        "privacyPolicy": "New Privacy policy"
      }
    },
    "pl": {
      "page:index": {},
      "nav": {},
      "footer": {}
    },
    "es": {
      "page:index": {},
      "nav": {},
      "footer": {}
    }
  }
  const expected = {
    "en": {
      "page:index": {
        "title": "New title",
        "body": "New content..."
      },
      "nav": {
        "home": "New home",
      },
      "footer": {
        "privacyPolicy": "Privacy policy"
      }
    },
    "cs": {
      "page:index": {
        "title": "Nadpis",
        "body": "Obsah..."
      },
      "nav": {
        "home": "Domu",
        "contacts": "Kontakty",
      }
    },
    "es": {
      "page:index": {},
      "nav": {},
      "footer": {
        "privacyPolicy": "Política de Privacidad"
      }
    },
    "pl": {
      "page:index": {},
      "nav": {}
    },
  }
  const result = updateContent(languages, keys, localContent, remoteContent)
  t.deepEqual(result, expected)
})
