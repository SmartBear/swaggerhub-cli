swaggerhub
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
$ npm install -g swaggerhub
$ swaggerhub COMMAND
running command...
$ swaggerhub (-v|--version|version)
swaggerhub/0.0.0 darwin-x64 node-v12.13.1
$ swaggerhub --help [COMMAND]
USAGE
  $ swaggerhub COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`swaggerhub api:create IDENTIFIER`](#swaggerhub-apicreate-identifier)
* [`swaggerhub api:version:get [IDENTIFIER]`](#swaggerhub-apiversionget-identifier)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help-command)

## `swaggerhub api:create IDENTIFIER`

Creates API in SwaggerHub

```
USAGE
  $ swaggerhub api:create IDENTIFIER

ARGUMENTS
  IDENTIFIER  Identifier for API in format OWNER/API_NAME/VERSION

OPTIONS
  -f, --file=file              (required) API file to create in SwaggerHub
  --oas=2|3                    (required) OAS Version of API
  --visibility=public|private  [default: private] Visibility of API in SwaggerHub

DESCRIPTION
  Creates API in SwaggerHub. Fails if API already exists
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/api/create.js)_

## `swaggerhub api:version:get [IDENTIFIER]`

Fetches an API version

```
USAGE
  $ swaggerhub api:version:get [IDENTIFIER]

OPTIONS
  -j, --json  Returns the API in JSON format.
```

_See code: [src/commands/api/version/get.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/api/version/get.js)_

## `swaggerhub configure`

Configure application settings

```
USAGE
  $ swaggerhub configure
```

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/configure.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
