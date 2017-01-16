# phraseapp-json-cli

> Script for downloading and updating translations from PhraseApp project.
  `download` command will fetch all translations for all languages and save them to .json file. 
  `update` command will fetch only specified keys and languages and update existing translation file  

## Install

```
$ npm install --global phraseapp-json-cli
```

## Usage

```sh
 $ update-content [options] [command] 
```

### Options

    -o, --output <path>           relative path to which new content should be written
    -p, --project-id <value>      PhraseApp project ID
    -t, --access-token <value>    PhraseApp access token
    -d, --default-locale <value>  default locale

### Commands

    update [options]   update translations for given languages and keys
    download           download all PhraseApp translations

#### `update` command options

    -k, --keys <list>     comma-separated list of keys to update
    -l, --langs <list>    comma-separated list of languages for which keys should be updated
    -c, --content <path>  relative path to current content


## Env variables 

	DEFAULT_LOCALE 
	PHRASEAPP_ACCESS_TOKEN
	PHRASEAPP_PROJECT_ID
	CONTENT
	OUTPUT

## License

MIT © [Lusk](https://lusk.io)
