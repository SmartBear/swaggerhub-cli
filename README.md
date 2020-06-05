swaggerhub
==========

cli to interact with https://app.swaggerhub.com

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Contributing](#contributing)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm i -g swaggerhub-cli-0.1.2.tgz
$ swaggerhub COMMAND
running command...
$ swaggerhub (-v|--version|version)
swaggerhub/0.1.2 darwin-x64 node-v12.13.0
$ swaggerhub --help [COMMAND]
USAGE
  $ swaggerhub COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`swaggerhub api:create OWNER/API_NAME/VERSION`](#swaggerhub-apicreate-ownerapi_nameversion)
* [`swaggerhub api:publish OWNER/API_NAME/VERSION`](#swaggerhub-apipublish-ownerapi_nameversion)
* [`swaggerhub api:version:get OWNER/API_NAME/VERSION`](#swaggerhub-apiversionget-ownerapi_nameversion)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help-command)

## `swaggerhub api:create OWNER/API_NAME/VERSION`

creates a new API / API version

```
USAGE
  $ swaggerhub api:create OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API to create in SwaggerHub

OPTIONS
  -f, --file=file              (required) file location of API to create
  --visibility=public|private  [default: private] visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  An error will occur if the API version already exists.

EXAMPLES
  swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public
  swaggerhub api:create organization/api --file api.yaml
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.2/src/commands/api/create.js)_

## `swaggerhub api:publish OWNER/API_NAME/VERSION`

publish an API version

```
USAGE
  $ swaggerhub api:publish OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API to publish

EXAMPLE
  swaggerhub api:publish organization/api/1.0.0
```

_See code: [src/commands/api/publish.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.2/src/commands/api/publish.js)_

## `swaggerhub api:version:get OWNER/API_NAME/VERSION`

fetches an API version

```
USAGE
  $ swaggerhub api:version:get OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API version in SwaggerHub

OPTIONS
  -j, --json  returns the API in JSON format.

DESCRIPTION
  Returns the API in YAML format by default.

EXAMPLE
  swaggerhub api:version:get organization/api/1.0.0 --json
```

_See code: [src/commands/api/version/get.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.2/src/commands/api/version/get.js)_

## `swaggerhub configure`

configure application settings

```
USAGE
  $ swaggerhub configure

DESCRIPTION
  Enter the SwaggerHub URL - default is https://api.swaggerhub.com
  Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
  You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config 
  settings.
```

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.2/src/commands/configure.js)_

## `swaggerhub help [COMMAND]`

display help for swaggerhub

```
USAGE
  $ swaggerhub help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_
<!-- commandsstop -->

# Contributing
<!-- contributing -->
This project is currently in active development. We may make changes to how the tool works until we mark this project as stable.
<!-- contributingstop -->
