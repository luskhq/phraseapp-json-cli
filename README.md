# phraseapp-json-cli

CLI commands used to [download](#download-command) all [**PhraseApp**](https://phraseapp.com) translations, 
[update](#update-command) existing translations JSON file or 
[upload](#upload-command) translations to PhraseApp.

## Installation

```bash
$ npm install --global phraseapp-json-cli
```

## Usage

```bash
$ pa [options] [command] 
```

### `download` command   

Download all PhraseApp translations for all available languages to target path.
Untranslated keys will be taken from default locale.

#### Usage

```bash
$ pa download [options] <path>
```

##### Options

- `-h, --help`                    output usage information
- `-p, --project-id <value>`      PhraseApp project ID
- `-t, --access-token <value>`    PhraseApp access token
- `-d, --default-locale <value>`  default locale code to which empty keys should fall back to
		
##### Parameters
	
- `path` relative path to which downloaded JSON file should be written

##### Example

Download PhraseApp translations and save it to `content.json` file (`en` will be default locale). 

```bash
$ pa download -p 2ab148c83062e85958e2b9b423eb1b5c -t 4ccd6e8v8549f49ef315fd763799a639e136878494a21947d8cfb3685bfb384e -d en content.json 
```

### `update` command

Update specified keys for given languages in existing content JSON file.
Untranslated keys will be taken from default locale.

#### Usage

```bash	
$ pa update [options] <keys> <langs> <path>
```

##### Options

- `-h, --help`                    output usage information
- `-p, --project-id <value>`      PhraseApp project ID
- `-t, --access-token <value>`    PhraseApp access token
- `-d, --default-locale <value>`  default locale code to which empty keys should fall back to

##### Parameters 

- `keys` 		comma-separated list of keys to update
- `langs`		comma-separated list of languages for which keys should be updated
- `path`		relative path to JSON file which will be updated

##### Example  

Download PhraseApp translations of `footer` and `header` keys for `cs` and `pl` locales and update values in existing `content.json` file      
(`en` will be default locale).

```bash
$ pa update -p 2ab148c83062e85958e2b9b423eb1b5c -t 4ccd6e8v8549f49ef315fd763799a639e136878494a21947d8cfb3685bfb384e -d en footer,header cs,pl content.json 
```

### `upload` command     

Upload specified content file to PhraseApp.

#### Usage  

```bash
$ pa upload [options] <path> 
```

##### Options

- `-h, --help`                    output usage information
- `-p, --project-id <value>`      PhraseApp project ID
- `-t, --access-token <value>`    PhraseApp access token

##### Parameters 

- `path` relative path to JSON file which will be uploaded

##### Example  

Upload JSON file `translations.json` to PhraseApp project.      

```bash
$ pa upload -p 2ab148c83062e85958e2b9b423eb1b5c -t 4ccd6e8v8549f49ef315fd763799a639e136878494a21947d8cfb3685bfb384e translations.json 
```

## Env variables

Options could be set as following environment variables:

- PHRASEAPP_DEFAULT_LOCALE  
- PHRASEAPP_ACCESS_TOKEN
- PHRASEAPP_PROJECT_ID

## License

MIT © [Lusk](https://lusk.io)
