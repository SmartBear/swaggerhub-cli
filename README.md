swaggerhub
==========

cli to interact with https://app.swaggerhub.com

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/swaggerhub.svg)](https://npmjs.org/package/swaggerhub)
[![License](https://img.shields.io/npm/l/swaggerhub.svg)](https://github.com/SmartBear/swaggerhub-cmd/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm i -g https://cli.swaggerhub.com/swaggerhub-cli-0.1.0.tgz
$ swaggerhub COMMAND
running command...
$ swaggerhub (-v|--version|version)
swaggerhub/0.0.0 darwin-x64 node-v12.13.0
$ swaggerhub --help [COMMAND]
USAGE
  $ swaggerhub COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`swaggerhub api:create IDENTIFIER`](#swaggerhub-apicreate-identifier)
* [`swaggerhub api:version:get IDENTIFIER`](#swaggerhub-apiversionget-identifier)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help-command)

## `swaggerhub api:create IDENTIFIER`

creates an API

```
USAGE
  $ swaggerhub api:create IDENTIFIER

ARGUMENTS
  IDENTIFIER  identifier for API in {owner}/{api_name}/{version} format

OPTIONS
  -f, --file=file              (required) file location of API to create
  --oas=2|3                    (required) OAS version of API
  --visibility=public|private  [default: private] visibility of API in SwaggerHub

DESCRIPTION
  command will fail if the API already exists.
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/api/create.js)_

## `swaggerhub api:version:get IDENTIFIER`

fetches an API version

```
USAGE
  $ swaggerhub api:version:get IDENTIFIER

ARGUMENTS
  IDENTIFIER  identifier for API in {owner}/{api_name}/{version} format

OPTIONS
  -j, --json  returns the API in JSON format.
```

_See code: [src/commands/api/version/get.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.0.0/src/commands/api/version/get.js)_

## `swaggerhub configure`

configure application settings

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
