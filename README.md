shub
==========

cli to interact with https://app.swaggerhub.com

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/swaggerhub.svg)](https://npmjs.org/package/swaggerhub)
[![Downloads/week](https://img.shields.io/npm/dw/swaggerhub.svg)](https://npmjs.org/package/swaggerhub)
[![License](https://img.shields.io/npm/l/swaggerhub.svg)](https://github.com/SmartBear/swaggerhub-cmd/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g shub
$ shub COMMAND
running command...
$ shub (-v|--version|version)
shub/0.0.0 darwin-x64 node-v12.13.1
$ shub --help [COMMAND]
USAGE
  $ shub COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shub api:create IDENTIFIER`](#shub-apicreate-identifier)
* [`shub api:version:get [IDENTIFIER]`](#shub-apiversionget-identifier)
* [`shub configure`](#shub-configure)
* [`shub help [COMMAND]`](#shub-help-command)

## `shub api:create IDENTIFIER`

Creates API in SwaggerHub

```
USAGE
  $ shub api:create IDENTIFIER

ARGUMENTS
  IDENTIFIER  Identifier for API in format OWNER/API_NAME/VERSION

OPTIONS
  -f, --file=file              (required) API yaml file to create in SwaggerHub
  --oasVersion=2.0|3.0.0       [default: 3.0.0] OAS Version of API
  --visibility=public|private  [default: private] Visibility of API in SwaggerHub
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/api/create.js)_

## `shub api:version:get [IDENTIFIER]`

Fetches an API version

```
USAGE
  $ shub api:version:get [IDENTIFIER]

OPTIONS
  -j, --json  Returns the API in JSON format.
```

_See code: [src/commands/api/version/get.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/api/version/get.js)_

## `shub configure`

Configure application settings

```
USAGE
  $ shub configure
```

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/configure.js)_

## `shub help [COMMAND]`

display help for shub

```
USAGE
  $ shub help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
