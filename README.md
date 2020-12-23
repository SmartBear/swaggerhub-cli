SwaggerHub CLI
==============

[![NPM](https://img.shields.io/npm/v/swaggerhub-cli.svg)](https://www.npmjs.com/package/swaggerhub-cli)

The SwaggerHub CLI enables teams to build automation and workflows around SwaggerHub. Teams can use it in places like their CI/CD pipeline to create new APIs, create and update API versions, and mark API versions as published and default among other features. Every team has their own workflow, and the SwaggerHub CLI can help teams build the workflow that fits their needs.

<!-- toc -->
* [Requirements](#requirements)
* [Installation](#installation)
* [Setup](#setup)
* [Additional configuration for SwaggerHub On-Premise](#additional-configuration-for-swaggerhub-on-premise)
* [Usage](#usage)
* [Commands](#commands)
* [Plugins](#plugins)
* [Contributing](#contributing)
<!-- tocstop -->
# Requirements
Node.js 10 or later.
# Installation
```sh-session
$ npm i -g swaggerhub-cli
```
# Setup
The SwaggerHub CLI can be configured through environment variables or through the [`swaggerhub configure`](#swaggerhub-configure) command. The CLI will look for the following environment variables.

* `SWAGGERHUB_API_KEY` (required) – **Important: keep this key secure.** This is the SwaggerHub API key the CLI will use for authentication. You can find your API key on the [user settings page](https://app.swaggerhub.com/settings/apiKey) in SwaggerHub.
* `SWAGGERHUB_URL` (optional, default is `https://api.swaggerhub.com/`) – Customers with on-premise installations need to point this to their on-premise API, which is `http(s)://{swaggerhub-host}/v1` (do not append a backslash). 

Alernatively, you can use the `swaggerhub configure` command to create a configuration file for the CLI to use. This command will walk you through the steps to set up the necessary configurations.

```sh-session
$ swaggerhub configure
? SwaggerHub URL: https://api.swaggerhub.com
? API Key: <your-api-key>
```

Environment variables take precedence over the configuration file created by this command.

## Additional configuration for SwaggerHub On-Premise

If your SwaggerHub On-Premise instance uses a **self-signed or privately signed SSL certificate**, there are additional steps required to make the SwaggerHub CLI trust this certificate.

By default, Node.js rejects self-signed or privately signed SSL certificates because their root CA is not known. You will see an error like this in the CLI output:

```
FetchError: request to https://... failed, reason: self signed certificate
```

The solution is to use the [`NODE_EXTRA_CA_CERTS`](https://nodejs.org/api/cli.html#cli_node_extra_ca_certs_file) environment variable to specify custom trusted certificates for Node.js.

Start by creating a .pem file containing your custom trusted certificates in the PEM format.
* If the certificate is _self-signed_ (so that it is its own CA), include the certificate itself.
* If the certificate is _signed by a private CA_, include the CA root and any intermediate certificates, in any order. Blank lines are allowed, but optional, between individual certificates.

```
-----BEGIN CERTIFICATE-----
CA root certificate
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
Intermediate certificate 1
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
Intermediate certificate 2
-----END CERTIFICATE-----
```

Specify the path to this PEM file in the `NODE_EXTRA_CA_CERTS` environment variable.

macOS/*nix/bash examples:
```sh-session
export NODE_EXTRA_CA_CERTS=~/Work/extra-ca-certs.pem   # '~' means the home folder of the logged-in user

export NODE_EXTRA_CA_CERTS=$HOME/.ssh/extra-ca-certs.pem

export NODE_EXTRA_CA_CERTS=/Users/username/Work/extra-ca-certs.pem
```

Windows examples:
```
:: Both forward and backslashes are OK
set NODE_EXTRA_CA_CERTS=C:\Work\extra-ca-certs.pem
set NODE_EXTRA_CA_CERTS=C:/Work/extra-ca-certs.pem

:: You can also define the path itself using environment variables
set NODE_EXTRA_CA_CERTS=%USERPROFILE%\extra-ca-certs.pem
```

# Usage
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
# Commands
<!-- commands -->
* [`swaggerhub api:create OWNER/API_NAME/[VERSION]`](#swaggerhub-apicreate)
* [`swaggerhub api:get OWNER/API_NAME/[VERSION]`](#swaggerhub-apiget)
* [`swaggerhub api:publish OWNER/API_NAME/VERSION`](#swaggerhub-apipublish)
* [`swaggerhub api:setdefault OWNER/API_NAME/VERSION`](#swaggerhub-apisetdefault)
* [`swaggerhub api:unpublish OWNER/API_NAME/VERSION`](#swaggerhub-apiunpublish)
* [`swaggerhub api:update OWNER/API_NAME/[VERSION]`](#swaggerhub-apiupdate)
* [`swaggerhub api:validate OWNER/API_NAME/[VERSION]`](#swaggerhub-apivalidate)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub domain:get OWNER/DOMAIN_NAME/[VERSION]`](#swaggerhub-domainget)
* [`swaggerhub domain:publish OWNER/DOMAIN_NAME/VERSION`](#swaggerhub-domainpublish)
* [`swaggerhub domain:unpublish OWNER/DOMAIN_NAME/VERSION`](#swaggerhub-domainunpublish)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help-command)
* [`swaggerhub integration:create OWNER/API_NAME/[VERSION]`](#swaggerhub-integrationcreate)
* [`swaggerhub plugins`](#swaggerhub-plugins)
* [`swaggerhub plugins:install PLUGIN...`](#swaggerhub-pluginsinstall-plugin)
* [`swaggerhub plugins:link PLUGIN`](#swaggerhub-pluginslink-plugin)
* [`swaggerhub plugins:uninstall PLUGIN...`](#swaggerhub-pluginsuninstall-plugin)
* [`swaggerhub plugins:update`](#swaggerhub-pluginsupdate)

## `swaggerhub api:create`

creates a new API / API version from a YAML/JSON file

```
USAGE
  $ swaggerhub api:create OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to create in SwaggerHub

OPTIONS
  -f, --file=file              (required) file location of API to create
  -h, --help                   show CLI help
  --publish                    sets the API version as published
  --setdefault                 sets API version to be the default
  --visibility=public|private  [default: private] visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  An error will occur if the API version already exists.

EXAMPLES
  swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public
  swaggerhub api:create organization/api --file api.yaml
  swaggerhub api:create organization/api/1.0.0 --publish --file api.json
  swaggerhub api:create organization/api/1.0.0 --setdefault --file api.json
  swaggerhub api:create organization/api/1.0.0 --publish --setdefault --file api.json
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/create.js)_

## `swaggerhub api:get`

fetches an API definition

```
USAGE
  $ swaggerhub api:get OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  SwaggerHub API to fetch

OPTIONS
  -h, --help      show CLI help
  -j, --json      returns the API in JSON format.
  -r, --resolved  gets the resolved API definition (supported in v1.25+).

DESCRIPTION
  When VERSION is not included in the argument, the default version will be returned.
  Returns the API in YAML format by default.

EXAMPLES
  swaggerhub api:get organization/api
  swaggerhub api:get organization/api/1.0.0 --json
```

_See code: [src/commands/api/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/get.js)_

## `swaggerhub api:publish`

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

_See code: [src/commands/api/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/publish.js)_

## `swaggerhub api:setdefault`

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

_See code: [src/commands/api/setdefault.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/setdefault.js)_

## `swaggerhub api:unpublish`

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

_See code: [src/commands/api/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/unpublish.js)_

## `swaggerhub api:update`

update an API

```
USAGE
  $ swaggerhub api:update OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to update in SwaggerHub

OPTIONS
  -f, --file=file              file location of API to update
  -h, --help                   show CLI help
  --publish                    sets the API version as published
  --setdefault                 sets API version to be the default
  --visibility=public|private  visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  When no file is specified then the default API version will be updated.
  The API visibility can be changed by using visibility flag.

EXAMPLES
  swaggerhub api:update organization/api --file api.yaml
  swaggerhub api:update organization/api/1.0.0 --file api.json
  swaggerhub api:update organization/api/1.0.0 --publish --file api.json
  swaggerhub api:update organization/api/1.0.0 --setdefault --file api.json
  swaggerhub api:update organization/api/1.0.0 --publish --setdefault --file api.json
  swaggerhub api:update organization/api/1.0.0 --visibility=private
```

_See code: [src/commands/api/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/update.js)_

## `swaggerhub api:validate`

get validation result for an API version

```
USAGE
  $ swaggerhub api:validate OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API Identifier

OPTIONS
  -h, --help  show CLI help

DESCRIPTION
  When VERSION is not included in the argument, the default version will be validated.
  An error will occur if the API version does not exist.

EXAMPLES
  swaggerhub api:validate organization/api/1.0.0
  swaggerhub api:validate organization/api
```

_See code: [src/commands/api/validate.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/api/validate.js)_

## `swaggerhub configure`

configure application settings

```
USAGE
  $ swaggerhub configure

OPTIONS
  -h, --help  show CLI help

DESCRIPTION
  Enter the SwaggerHub URL - default is https://api.swaggerhub.com
  Customers with on-premise installations need to point this to their on-premise API, which is 
  http(s)://{swaggerhub-host}/v1
  Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
  You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config 
  settings.
```

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/configure.js)_

## `swaggerhub domain:get`

fetches a domain definition

```
USAGE
  $ swaggerhub domain:get OWNER/DOMAIN_NAME/[VERSION]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  SwaggerHub domain to fetch

OPTIONS
  -h, --help  show CLI help
  -j, --json  returns the domain in JSON format.

DESCRIPTION
  When VERSION is not included in the argument, the default version will be returned.
  Returns the domain in YAML format by default.

EXAMPLES
  swaggerhub domain:get organization/domain
  swaggerhub domain:get organization/domain/1.0.0 --json
```

_See code: [src/commands/domain/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/domain/get.js)_

## `swaggerhub domain:publish`

publish a domain version

```
USAGE
  $ swaggerhub domain:publish OWNER/DOMAIN_NAME/VERSION

ARGUMENTS
  OWNER/DOMAIN_NAME/VERSION  Domain identifier

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub domain:publish organization/domain/1.0.0
```

_See code: [src/commands/domain/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/domain/publish.js)_

## `swaggerhub domain:unpublish`

unpublish a domain version

```
USAGE
  $ swaggerhub domain:unpublish OWNER/DOMAIN_NAME/VERSION

ARGUMENTS
  OWNER/DOMAIN_NAME/VERSION  Domain identifier

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub domain:unpublish organization/domain/1.0.0
```

_See code: [src/commands/domain/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/domain/unpublish.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `swaggerhub integration:create`

creates a new API integation from a JSON configuration file.

```
USAGE
  $ swaggerhub integration:create OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API where integration will be added

OPTIONS
  -f, --file=file  (required) location of integration configuration file
  -h, --help       show CLI help

DESCRIPTION
  See the documentation for configuration files: 
  https://github.com/SmartBear/swaggerhub-cli/tree/master/examples/integrations
  When VERSION is not included in the argument, the integration will be added to be default API version.

EXAMPLE
  swaggerhub integration:create organization/api/1.0.0 --file config.json
```

_See code: [src/commands/integration/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.2.14/src/commands/integration/create.js)_

## `swaggerhub plugins`

list installed plugins

```
USAGE
  $ swaggerhub plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ swaggerhub plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.4/src/commands/plugins/index.ts)_

## `swaggerhub plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ swaggerhub plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ swaggerhub plugins:add

EXAMPLES
  $ swaggerhub plugins:install myplugin 
  $ swaggerhub plugins:install https://github.com/someuser/someplugin
  $ swaggerhub plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.4/src/commands/plugins/install.ts)_

## `swaggerhub plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ swaggerhub plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ swaggerhub plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.4/src/commands/plugins/link.ts)_

## `swaggerhub plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ swaggerhub plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ swaggerhub plugins:unlink
  $ swaggerhub plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.4/src/commands/plugins/uninstall.ts)_

## `swaggerhub plugins:update`

update installed plugins

```
USAGE
  $ swaggerhub plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.4/src/commands/plugins/update.ts)_
<!-- commandsstop -->

# Plugins

The SwaggerHub CLI supports plugins via the [oclif plugin](https://oclif.io/docs/plugins) infrastructure.

To install a plugin

```sh-session
$ swaggerhub plugins:install <github-url>
```

To list other options related to plugins

```sh-session
$ swaggerhub plugins --help
```

An example plugin used for fetching popular [JSON Schema](https://json-schema.org/) files, can be found here:  [https://github.com/ponelat/swaggerhub-cli-plugin-schema](https://github.com/ponelat/swaggerhub-cli-plugin-schema)

Example usage

```sh-session
$ swaggerhub plugins:install https://github.com/ponelat/swaggerhub-cli-plugin-schema
$ swaggerhub schema:list
  angular-cli-json
  ansible
  apple-app-site-association
  appsscript-json
  #...
$ swaggerhub schema:get ansible
  {
    "description": "Auto-Generated JSON Schema for Ansible-stable 2.9 (https://github.com/shaded-enmity/ansible-schema-generator)",
    "title": "Ansible 2.9",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
  # ...
```

# Contributing
<!-- contributing -->
The SwaggerHub CLI is currently in an active development phase—we will not be accepting Pull Requests at this time. If you’ve found any bugs or typos, or have a feature requests or general feedback you’d like to share, please open an [issue](https://github.com/SmartBear/swaggerhub-cli/issues) and let us know.
<!-- contributingstop -->
