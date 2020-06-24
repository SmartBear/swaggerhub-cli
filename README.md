SwaggerHub CLI
==============

A command-line interface for SwaggerHub API (https://api.swaggerhub.com). Supports SwaggerHub SaaS and On-Premise.

<!-- toc -->
* [Requirements](#requirements)
* [Installation](#installation)
* [Setup](#setup)
* [Usage](#usage)
* [Commands](#commands)
* [Contributing](#contributing)
<!-- tocstop -->
## Requirements
Node.js 10 or later.
## Installation
```sh-session
$ npm i -g swaggerhub-cli
```
## Setup
```sh-session
$ swaggerhub configure
? SwaggerHub URL: https://api.swaggerhub.com
? API Key: <your-api-key>
```
SwaggerHub URL defaults to the SaaS version, `https://api.swaggerhub.com`. The URL can be reset using the **configure** command

Alternatively, these values can be set using the `SWAGGERHUB_URL` and `SWAGGERHUB_API_KEY` environment variables. These take precedence over config values.
## Usage
```sh-session
$ swaggerhub COMMAND
running command...
$ swaggerhub (-v|--version|version)
swaggerhub/0.1.2 darwin-x64 node-v12.13.0
$ swaggerhub --help [COMMAND]
USAGE
  $ swaggerhub COMMAND
...
```
## Commands
<!-- commands -->
* [`swaggerhub api:create OWNER/API_NAME/[VERSION]`](#swaggerhub-apicreate-ownerapi_nameversion)
* [`swaggerhub api:get OWNER/API_NAME/[VERSION]`](#swaggerhub-apiget-ownerapi_nameversion)
* [`swaggerhub api:publish OWNER/API_NAME/VERSION`](#swaggerhub-apipublish-ownerapi_nameversion)
* [`swaggerhub api:setdefault OWNER/API_NAME/VERSION`](#swaggerhub-apisetdefault-ownerapi_nameversion)
* [`swaggerhub api:unpublish OWNER/API_NAME/VERSION`](#swaggerhub-apiunpublish-ownerapi_nameversion)
* [`swaggerhub api:update OWNER/API_NAME/[VERSION]`](#swaggerhub-apiupdate-ownerapi_nameversion)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help-command)

### swaggerhub api:create

creates a new API / API version from a YAML/JSON file

```
USAGE
  $ swaggerhub api:create OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to create in SwaggerHub

OPTIONS
  -f, --file=file              (required) file location of API to create
  -h, --help                   show CLI help
  --visibility=public|private  [default: private] visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  An error will occur if the API version already exists.

EXAMPLES
  swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public
  swaggerhub api:create organization/api --file api.yaml
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/api/create.js)_

### swaggerhub api:get

fetches an API definition

```
USAGE
  $ swaggerhub api:get OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  SwaggerHub API to fetch

OPTIONS
  -h, --help      show CLI help
  -j, --json      returns the API in JSON format.
  -r, --resolved  gets the resolved API definition.

DESCRIPTION
  When VERSION is not included in the argument, the default version will be returned.
  Returns the API in YAML format by default.

EXAMPLES
  swaggerhub api:get organization/api
  swaggerhub api:get organization/api/1.0.0 --json
```

_See code: [src/commands/api/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/api/get.js)_

### swaggerhub api:publish

publish an API version

```
USAGE
  $ swaggerhub api:publish OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API identifier

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub api:publish organization/api/1.0.0
```

_See code: [src/commands/api/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/api/publish.js)_

### swaggerhub api:setdefault

set the default version of an API

```
USAGE
  $ swaggerhub api:setdefault OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API identifier

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub api:setdefault organization/api/2.0.0
```

_See code: [src/commands/api/setdefault.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/api/setdefault.js)_

### swaggerhub api:unpublish

unpublish an API version

```
USAGE
  $ swaggerhub api:unpublish OWNER/API_NAME/VERSION

ARGUMENTS
  OWNER/API_NAME/VERSION  API identifier

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub api:unpublish organization/api/1.0.0
```

_See code: [src/commands/api/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/api/unpublish.js)_

### swaggerhub api:update

update an API version

```
USAGE
  $ swaggerhub api:update OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to update in SwaggerHub

OPTIONS
  -f, --file=file              (required) file location of API to update
  -h, --help                   show CLI help
  --visibility=public|private  [default: private] visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  An error will occur if the API version does not exist.

EXAMPLES
  swaggerhub api:update organization/api --file api.yaml
  swaggerhub api:update organization/api/1.0.0 --file api.json
```

_See code: [src/commands/api/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/api/update.js)_

### swaggerhub configure

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

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.3/src/commands/configure.js)_

### swaggerhub help [COMMAND]

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

## Contributing
<!-- contributing -->
The SwaggerHub CLI is currently in an active development phase—we will not be accepting Pull Requests at this time. If you’ve found any bugs or typos, or have a feature requests or general feedback you’d like to share, please open an [issue](https://github.com/SmartBear/swaggerhub-cli/issues) and let us know.
<!-- contributingstop -->

testing changelog
