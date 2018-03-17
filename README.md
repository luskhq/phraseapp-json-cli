# phraseapp-json-cli

This CLI provides commands for common tasks when working with translation strings using a nested JSON format.

The idea is that you have a single JSON file checked into source control, and you use the CLI to keep it (or parts of it) in sync with PhraseApp.

## Installation

```bash
npm install --global phraseapp-json-cli
```

## Usage

```bash
pa <command> [options] [<args>]
```

Available commands

* [download](#download-command)
* [update](#update-command)
* [upload](#upload-command)

All commands will require you to specify PhraseApp-related options like `--project-id` or `--access-token`. This is great for trying out the CLI, but specifying everything inline gets tedious very quickly. For your convenience, these options can be also specified as environment variables, which can be stored in `.env` file.

These environment variables correspond to CLI options, except that they are in SCREAMING_SNAKE_CASE and prefixed with PHRASEAPP. Eg. `--project-id` becomes `PHRASEAPP_PROJECT_ID`, `--access-token` becomes `PHRASEAPP_ACCESS_TOKEN`, etc...

All examples below are provided with the assumption that PhraseApp-related options are supplied using the following `.env` file:

```
PHRASEAPP_PROJECT_ID=2ab148c83062e85958e2b9b423eb1b5c
PHRASEAPP_ACCESS_TOKEN=4ccd6e8v8549f49ef315fd763799a639e136878494a21947d8cfb3685bfb384e
PHRASEAPP_DEFAULT_LOCALE=en
```

### `download` command

Downloads **all** PhraseApp translations for **all** available languages to target path. Untranslated keys will be taken from default locale.

#### Usage

```bash
pa download [options] <path>
```

##### Options

* `-h, --help` output usage information
* `--project-id <value>` PhraseApp project ID
* `--access-token <value>` PhraseApp access token
* `--fallback-locale <value>` default locale code to which empty keys should fall back to

##### Parameters

* `path` relative path to which downloaded JSON file will be written

##### Example

Download PhraseApp translations and save it to `content.json` file. Untranslated keys will be taken from default locale.

```bash
# Assuming PhraseApp options are set using .env file
pa download content.json
```

### `update` command

Update specified keys for given languages in existing content JSON file. Untranslated keys will be taken from default locale.

#### Usage

```bash
pa update [options] <keys> <langs> <path>
```

##### Options

* `-h, --help` output usage information
* `--project-id <value>` PhraseApp project ID
* `--access-token <value>` PhraseApp access token
* `--fallback-locale <value>` default locale code to which empty keys should fall back to

##### Parameters

* `keys` comma-separated list of keys to update
* `langs` comma-separated list of languages for which keys should be updated
* `path` relative path to JSON file which will be updated

##### Example

Download PhraseApp translations of `footer` and `header` keys for `cs` and `en` locales and update values in existing `content.json` file, falling back to `en` for missing translations.

```bash
# Assuming PhraseApp options are set using .env file
pa update footer,header cs,en content.json
```

### `upload` command

Upload specified content file to PhraseApp.

#### Usage

```bash
pa upload [options] <path>
```

##### Options

* `-h, --help` output usage information
* `--project-id <value>` PhraseApp project ID
* `--access-token <value>` PhraseApp access token

> If you're getting a 401 error, make sure your access token is read/write.

##### Parameters

* `path` relative path to JSON file which will be uploaded

##### Example

Upload JSON file `content.json` to PhraseApp project.

```bash
# Assuming PhraseApp options are set using .env file
pa upload content.json
```

## License

MIT © [Lusk](https://lusk.io)
