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
$ npm i -g swaggerhub-cli-0.1.1.tgz
$ swaggerhub COMMAND
running command...
$ swaggerhub (-v|--version|version)
swaggerhub/0.1.1 darwin-x64 node-v12.13.0
$ swaggerhub --help [COMMAND]
USAGE
  $ swaggerhub COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`swaggerhub api:create OWNER/API_NAME/VERSION`](#swaggerhub-apicreate-ownerapi_nameversion)
* [`swaggerhub api:version:get OWNER/API_NAME/VERSION`](#swaggerhub-apiversionget-ownerapi_nameversion)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help-command)

## `swaggerhub api:create OWNER/API_NAME/VERSION`

creates an API

```
USAGE
  $ swaggerhub api:create OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API version to create in SwaggerHub for owner

OPTIONS
  -f, --file=file              (required) file location of API to create
  --oas=2|3                    (required) OAS version of API
  --visibility=public|private  [default: private] visibility of API in SwaggerHub

DESCRIPTION
  command will fail if the API already exists.

EXAMPLE
  swaggerhub api:create organization/api/1.0.0 --file api.yaml --oas 3 --visibility public
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.1/src/commands/api/create.js)_

## `swaggerhub api:version:get OWNER/API_NAME/VERSION`

fetches an API version

```
USAGE
  $ swaggerhub api:version:get OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API version in SwaggerHub for owner

OPTIONS
  -j, --json  returns the API in JSON format.

EXAMPLE
  swaggerhub api:version:get organization/api/1.0.0 --json
```

_See code: [src/commands/api/version/get.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.1/src/commands/api/version/get.js)_

## `swaggerhub configure`

configure application settings

```
USAGE
  $ swaggerhub configure
```

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cmd/blob/v0.1.1/src/commands/configure.js)_

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
