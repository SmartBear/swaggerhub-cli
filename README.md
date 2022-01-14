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
Node.js 12 or later.
# Installation
```sh-session
$ npm i -g swaggerhub-cli
```
# Setup
The SwaggerHub CLI can be configured through environment variables or through the [`swaggerhub configure`](#swaggerhub-configure) command. The CLI will look for the following environment variables.

* `SWAGGERHUB_API_KEY` (required) – **Important: keep this key secure.** This is the SwaggerHub API key the CLI will use for authentication. You can find your API key on the [user settings page](https://app.swaggerhub.com/settings/apiKey) in SwaggerHub.
* `SWAGGERHUB_URL` (optional, default is `https://api.swaggerhub.com`) – Customers with on-premise installations need to point this to their on-premise API, which is `http(s)://{swaggerhub-host}/v1` (do not append a backslash).

Alernatively, you can use the `swaggerhub configure` command to create a configuration file for the CLI to use. This command will walk you through the steps to set up the necessary configurations.

```sh-session
$ swaggerhub configure
? SwaggerHub URL: https://api.swaggerhub.com
? API Key: <your-api-key>
```

Environment variables take precedence over the configuration file created by this command.

# Additional configuration for SwaggerHub On-Premise

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
* [`swaggerhub api:delete OWNER/API_NAME/[VERSION]`](#swaggerhub-apidelete)
* [`swaggerhub api:get OWNER/API_NAME/[VERSION]`](#swaggerhub-apiget)
* [`swaggerhub api:publish OWNER/API_NAME/VERSION`](#swaggerhub-apipublish)
* [`swaggerhub api:setdefault OWNER/API_NAME/VERSION`](#swaggerhub-apisetdefault)
* [`swaggerhub api:unpublish OWNER/API_NAME/VERSION`](#swaggerhub-apiunpublish)
* [`swaggerhub api:update OWNER/API_NAME/[VERSION]`](#swaggerhub-apiupdate)
* [`swaggerhub api:validate OWNER/API_NAME/[VERSION]`](#swaggerhub-apivalidate)
* [`swaggerhub configure`](#swaggerhub-configure)
* [`swaggerhub domain:create OWNER/DOMAIN_NAME/[VERSION]`](#swaggerhub-domaincreate)
* [`swaggerhub domain:delete OWNER/DOMAIN_NAME/[VERSION]`](#swaggerhub-domaindelete)
* [`swaggerhub domain:get OWNER/DOMAIN_NAME/[VERSION]`](#swaggerhub-domainget)
* [`swaggerhub domain:publish OWNER/DOMAIN_NAME/VERSION`](#swaggerhub-domainpublish)
* [`swaggerhub domain:setdefault OWNER/DOMAIN_NAME/VERSION`](#swaggerhub-domainsetdefault)
* [`swaggerhub domain:unpublish OWNER/DOMAIN_NAME/VERSION`](#swaggerhub-domainunpublish)
* [`swaggerhub domain:update OWNER/DOMAIN_NAME/[VERSION]`](#swaggerhub-domainupdate)
* [`swaggerhub help [COMMAND]`](#swaggerhub-help)
* [`swaggerhub integration:create OWNER/API_NAME/[VERSION]`](#swaggerhub-integrationcreate)
* [`swaggerhub integration:delete OWNER/API_NAME/VERSION/INTEGRATION_ID`](#swaggerhub-integrationdelete)
* [`swaggerhub integration:execute OWNER/API_NAME/VERSION/INTEGRATION_ID`](#swaggerhub-integrationexecute)
* [`swaggerhub integration:get OWNER/API_NAME/VERSION/INTEGRATION_ID`](#swaggerhub-integrationget)
* [`swaggerhub integration:list OWNER/API_NAME/[VERSION]`](#swaggerhub-integrationlist)
* [`swaggerhub integration:update OWNER/API_NAME/VERSION/INTEGRATION_ID`](#swaggerhub-integrationupdate)
* [`swaggerhub plugins`](#swaggerhub-plugins)
* [`swaggerhub plugins:inspect PLUGIN...`](#swaggerhub-pluginsinspect)
* [`swaggerhub plugins:install PLUGIN...`](#swaggerhub-pluginsinstall)
* [`swaggerhub plugins:link PLUGIN`](#swaggerhub-pluginslink)
* [`swaggerhub plugins:uninstall PLUGIN...`](#swaggerhub-pluginsuninstall)
* [`swaggerhub plugins:update`](#swaggerhub-pluginsupdate)
* [`swaggerhub project:api:add OWNER/PROJECT_NAME API`](#swaggerhub-projectapiadd)
* [`swaggerhub project:api:remove OWNER/PROJECT_NAME API`](#swaggerhub-projectapiremove)
* [`swaggerhub project:create OWNER/PROJECT_NAME`](#swaggerhub-projectcreate)
* [`swaggerhub project:delete OWNER/PROJECT_NAME`](#swaggerhub-projectdelete)
* [`swaggerhub project:domain:add OWNER/PROJECT_NAME DOMAIN`](#swaggerhub-projectdomainadd)
* [`swaggerhub project:domain:remove OWNER/PROJECT_NAME DOMAIN`](#swaggerhub-projectdomainremove)
* [`swaggerhub project:get OWNER/PROJECT_NAME`](#swaggerhub-projectget)
* [`swaggerhub project:list [OWNER]`](#swaggerhub-projectlist)
* [`swaggerhub project:member:list OWNER/PROJECT_NAME`](#swaggerhub-projectmemberlist)

## `swaggerhub api:create`

creates a new API / API version from a YAML/JSON file

```
USAGE
  $ swaggerhub api:create OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to create in SwaggerHub

OPTIONS
  -f, --file=file                (required) file location of API to create
  -h, --help                     show CLI help
  --published=publish|unpublish  [default: unpublish] sets the lifecycle setting of the API version
  --setdefault                   sets API version to be the default
  --visibility=public|private    [default: private] visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  An error will occur if the API version already exists.

EXAMPLES
  swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public
  swaggerhub api:create organization/api --file api.yaml
  swaggerhub api:create organization/api/1.0.0 --published=publish --file api.json
  swaggerhub api:create organization/api/1.0.0 --setdefault --file api.json
  swaggerhub api:create organization/api/1.0.0 --published=publish --setdefault --file api.json
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/create.js)_

## `swaggerhub api:delete`

delete an API or API version

```
USAGE
  $ swaggerhub api:delete OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to delete in SwaggerHub

OPTIONS
  -f, --force  delete API without prompting for confirmation
  -h, --help   show CLI help

EXAMPLES
  swaggerhub api:delete organization/api/1.0.0
  swaggerhub api:delete organization/api
  swaggerhub api:delete organization/api --force
```

_See code: [src/commands/api/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/delete.js)_

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

_See code: [src/commands/api/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/get.js)_

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

_See code: [src/commands/api/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/publish.js)_

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

_See code: [src/commands/api/setdefault.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/setdefault.js)_

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

_See code: [src/commands/api/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/unpublish.js)_

## `swaggerhub api:update`

update an API

```
USAGE
  $ swaggerhub api:update OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to update in SwaggerHub

OPTIONS
  -f, --file=file                file location of API to update
  -h, --help                     show CLI help
  --published=publish|unpublish  sets the lifecycle setting of the API version
  --setdefault                   sets API version to be the default
  --visibility=public|private    visibility of API in SwaggerHub

DESCRIPTION
  The API version from the file will be used unless the version is specified in the command argument.
  When no file is specified then the default API version will be updated.
  The API visibility can be changed by using visibility flag.

EXAMPLES
  swaggerhub api:update organization/api --file api.yaml
  swaggerhub api:update organization/api/1.0.0 --file api.json
  swaggerhub api:update organization/api/1.0.0 --published=publish --file api.json
  swaggerhub api:update organization/api/1.0.0 --setdefault --file api.json
  swaggerhub api:update organization/api/1.0.0 --published=unpublish --setdefault --file api.json
  swaggerhub api:update organization/api/1.0.0 --visibility=private
```

_See code: [src/commands/api/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/update.js)_

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

_See code: [src/commands/api/validate.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/api/validate.js)_

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

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/configure.js)_

## `swaggerhub domain:create`

creates a new domain / domain version from a YAML/JSON file

```
USAGE
  $ swaggerhub domain:create OWNER/DOMAIN_NAME/[VERSION]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  Domain to create in SwaggerHub

OPTIONS
  -f, --file=file                (required) file location of domain to create
  -h, --help                     show CLI help
  --published=publish|unpublish  [default: unpublish] sets the lifecycle setting of the domain version
  --setdefault                   sets domain version to be the default
  --visibility=public|private    [default: private] visibility of domain in SwaggerHub

DESCRIPTION
  The domain version from the file will be used unless the version is specified in the command argument.
  An error will occur if the domain version already exists.

EXAMPLES
  swaggerhub domain:create organization/domain/1.0.0 --file domain.yaml --visibility public
  swaggerhub domain:create organization/domain --file domain.yaml
  swaggerhub domain:create organization/domain/1.0.0 --publish --file domain.json
  swaggerhub domain:create organization/domain/1.0.0 --setdefault --file domain.json
  swaggerhub domain:create organization/domain/1.0.0 --publish --setdefault --file domain.json
```

_See code: [src/commands/domain/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/create.js)_

## `swaggerhub domain:delete`

delete a domain or domain version

```
USAGE
  $ swaggerhub domain:delete OWNER/DOMAIN_NAME/[VERSION]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  Domain to delete in SwaggerHub

OPTIONS
  -f, --force  delete domain without prompting for confirmation
  -h, --help   show CLI help

EXAMPLES
  swaggerhub domain:delete organization/domain/1.0.0
  swaggerhub domain:delete organization/domain
  swaggerhub domain:delete organization/domain --force
```

_See code: [src/commands/domain/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/delete.js)_

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

_See code: [src/commands/domain/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/get.js)_

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

_See code: [src/commands/domain/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/publish.js)_

## `swaggerhub domain:setdefault`

set the default version of a domain

```
USAGE
  $ swaggerhub domain:setdefault OWNER/DOMAIN_NAME/VERSION

ARGUMENTS
  OWNER/DOMAIN_NAME/VERSION  domain identifier

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub domain:setdefault organization/domain/2.0.0
```

_See code: [src/commands/domain/setdefault.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/setdefault.js)_

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

_See code: [src/commands/domain/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/unpublish.js)_

## `swaggerhub domain:update`

update a domain

```
USAGE
  $ swaggerhub domain:update OWNER/DOMAIN_NAME/[VERSION]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  domain to update in SwaggerHub

OPTIONS
  -f, --file=file                file location of domain to update
  -h, --help                     show CLI help
  --published=publish|unpublish  sets the lifecycle setting of the domain version
  --setdefault                   sets domain version to be the default
  --visibility=public|private    visibility of domain in SwaggerHub

DESCRIPTION
  The domain version from the file will be used unless the version is specified in the command argument.
  When no file is specified then the default domain version will be updated.
  The domain visibility can be changed by using visibility flag.

EXAMPLES
  swaggerhub domain:update organization/domain --file domain.yaml
  swaggerhub domain:update organization/domain/1.0.0 --file domain.json
  swaggerhub domain:update organization/domain/1.0.0 --published=publish --file domain.json
  swaggerhub domain:update organization/domain/1.0.0 --setdefault --file domain.json
  swaggerhub domain:update organization/domain/1.0.0 --published=unpublish --setdefault --file domain.json
  swaggerhub domain:update organization/domain/1.0.0 --visibility=private
```

_See code: [src/commands/domain/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/domain/update.js)_

## `swaggerhub help`

display help for swaggerhub

```
USAGE
  $ swaggerhub help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.3.1/src/commands/help.ts)_

## `swaggerhub integration:create`

creates a new API integration from a JSON configuration file.

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

_See code: [src/commands/integration/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/integration/create.js)_

## `swaggerhub integration:delete`

deletes the integration from the given API.

```
USAGE
  $ swaggerhub integration:delete OWNER/API_NAME/VERSION/INTEGRATION_ID

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to delete

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub integration:delete organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704
```

_See code: [src/commands/integration/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/integration/delete.js)_

## `swaggerhub integration:execute`

executes an integration for the given API.

```
USAGE
  $ swaggerhub integration:execute OWNER/API_NAME/VERSION/INTEGRATION_ID

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to execute for given API

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub integration:execute organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704
```

_See code: [src/commands/integration/execute.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/integration/execute.js)_

## `swaggerhub integration:get`

retieves an integration for the given API.

```
USAGE
  $ swaggerhub integration:get OWNER/API_NAME/VERSION/INTEGRATION_ID

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to fetch for given API

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub integration:get organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704
```

_See code: [src/commands/integration/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/integration/get.js)_

## `swaggerhub integration:list`

list integrations on an API.

```
USAGE
  $ swaggerhub integration:list OWNER/API_NAME/[VERSION]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to list integrations on

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub integration:list organization/api/1.0.0
```

_See code: [src/commands/integration/list.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/integration/list.js)_

## `swaggerhub integration:update`

update the configuration of an API integration.

```
USAGE
  $ swaggerhub integration:update OWNER/API_NAME/VERSION/INTEGRATION_ID

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to update on the given API

OPTIONS
  -f, --file=file  (required) location of integration configuration file
  -h, --help       show CLI help

EXAMPLE
  swaggerhub integration:update organization/api/1.0.0/503c2db6-448a-4678-abcd-0123456789abc --file config.json
```

_See code: [src/commands/integration/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/integration/update.js)_

## `swaggerhub plugins`

List installed plugins.

```
USAGE
  $ swaggerhub plugins

OPTIONS
  --core  Show core plugins.

EXAMPLE
  $ swaggerhub plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `swaggerhub plugins:inspect`

Displays installation properties of a plugin.

```
USAGE
  $ swaggerhub plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

OPTIONS
  -h, --help     Show CLI help.
  -v, --verbose

EXAMPLE
  $ swaggerhub plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/inspect.ts)_

## `swaggerhub plugins:install`

Installs a plugin into the CLI.

```
USAGE
  $ swaggerhub plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

OPTIONS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/install.ts)_

## `swaggerhub plugins:link`

Links a plugin into the CLI for development.

```
USAGE
  $ swaggerhub plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
   command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ swaggerhub plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/link.ts)_

## `swaggerhub plugins:uninstall`

Removes a plugin from the CLI.

```
USAGE
  $ swaggerhub plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     Show CLI help.
  -v, --verbose

ALIASES
  $ swaggerhub plugins:unlink
  $ swaggerhub plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/uninstall.ts)_

## `swaggerhub plugins:update`

Update installed plugins.

```
USAGE
  $ swaggerhub plugins:update

OPTIONS
  -h, --help     Show CLI help.
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/update.ts)_

## `swaggerhub project:api:add`

Adds an API to an existing project.

```
USAGE
  $ swaggerhub project:api:add OWNER/PROJECT_NAME API

ARGUMENTS
  OWNER/PROJECT_NAME  The project to add the API to
  API                 The name of the API to add

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub project:api:add organization/project_name my_api
```

_See code: [src/commands/project/api/add.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/api/add.js)_

## `swaggerhub project:api:remove`

Removes an API from a project in SwaggerHub.

```
USAGE
  $ swaggerhub project:api:remove OWNER/PROJECT_NAME API

ARGUMENTS
  OWNER/PROJECT_NAME  The project remove the API from
  API                 The API to remove

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub project:api:remove organization/project_name my_api
```

_See code: [src/commands/project/api/remove.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/api/remove.js)_

## `swaggerhub project:create`

Creates a new project in SwaggerHub.

```
USAGE
  $ swaggerhub project:create OWNER/PROJECT_NAME

ARGUMENTS
  OWNER/PROJECT_NAME  The new project to create

OPTIONS
  -a, --apis=apis            Comma separated list of api names to include in project
  -d, --domains=domains      Comma separated list of domain names to include in project
  -h, --help                 show CLI help
  --description=description  Description of project

EXAMPLES
  swaggerhub project:create organization/new_project_name --description "project description"
  swaggerhub project:create organization/new_project_name -a "testapi1,testapi2"
  swaggerhub project:create organization/new_project_name --apis "testapi1,testapi2"
  swaggerhub project:create organization/new_project_name -d "testdomain3,testdomain4"
  swaggerhub project:create organization/new_project_name --domains "testdomain3,testdomain4"
  swaggerhub project:create organization/new_project_name -a "testapi1" -d "testdomain3" --description "description"
```

_See code: [src/commands/project/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/create.js)_

## `swaggerhub project:delete`

Deletes a project from SwaggerHub.

```
USAGE
  $ swaggerhub project:delete OWNER/PROJECT_NAME

ARGUMENTS
  OWNER/PROJECT_NAME  Project to delete

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub project:delete organization/project_name
```

_See code: [src/commands/project/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/delete.js)_

## `swaggerhub project:domain:add`

Adds a domain to an existing project.

```
USAGE
  $ swaggerhub project:domain:add OWNER/PROJECT_NAME DOMAIN

ARGUMENTS
  OWNER/PROJECT_NAME  The project to add the domain to
  DOMAIN              The name of the domain to add

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub project:domain:add organization/project_name my_domain
```

_See code: [src/commands/project/domain/add.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/domain/add.js)_

## `swaggerhub project:domain:remove`

Removes a domain from a project in SwaggerHub.

```
USAGE
  $ swaggerhub project:domain:remove OWNER/PROJECT_NAME DOMAIN

ARGUMENTS
  OWNER/PROJECT_NAME  The project remove the domain from
  DOMAIN              The domain to remove

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub project:domain:remove organization/project_name my_domain
```

_See code: [src/commands/project/domain/remove.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/domain/remove.js)_

## `swaggerhub project:get`

Retrieves the details for a project.

```
USAGE
  $ swaggerhub project:get OWNER/PROJECT_NAME

ARGUMENTS
  OWNER/PROJECT_NAME  Project to retrieve the details for

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  swaggerhub project:get organization/project_name
```

_See code: [src/commands/project/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/get.js)_

## `swaggerhub project:list`

list projects

```
USAGE
  $ swaggerhub project:list [OWNER]

ARGUMENTS
  OWNER  Organization to list projects for

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  swaggerhub project:list
  swaggerhub project:list organization
```

_See code: [src/commands/project/list.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/list.js)_

## `swaggerhub project:member:list`

list members of a project

```
USAGE
  $ swaggerhub project:member:list OWNER/PROJECT_NAME

ARGUMENTS
  OWNER/PROJECT_NAME  Project to list members of

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  swaggerhub project:list
  swaggerhub project:list organization
```

_See code: [src/commands/project/member/list.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.5.0/src/commands/project/member/list.js)_
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
