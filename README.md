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
Node.js 20.x or later.

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
* [`swaggerhub api:validate:download-rules OWNER`](#swaggerhub-apivalidatedownload)
* [`swaggerhub api:validate:local`](#swaggerhub-apivalidatelocal)
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
* [`swaggerhub plugins:add PLUGIN`](#swaggerhub-pluginsadd)
* [`swaggerhub plugins:inspect PLUGIN...`](#swaggerhub-pluginsinspect)
* [`swaggerhub plugins:install PLUGIN`](#swaggerhub-pluginsinstall)
* [`swaggerhub plugins:link PATH`](#swaggerhub-pluginslink)
* [`swaggerhub plugins:remove [PLUGIN]`](#swaggerhub-pluginsremove)
* [`swaggerhub plugins:reset`](#swaggerhub-pluginsreset)
* [`swaggerhub plugins:uninstall [PLUGIN]`](#swaggerhub-pluginsuninstall)
* [`swaggerhub plugins:unlink [PLUGIN]`](#swaggerhub-pluginsunlink)
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
* [`swaggerhub spectral:upload OWNER/RULESET_NAME/VERSION directory`](#swaggerhub-spectralupload)
* [`swaggerhub spectral:download OWNER/RULESET_NAME/VERSION directory`](#swaggerhub-spectraldownload)

## `swaggerhub api:create`

creates a new API / API version from a YAML/JSON file

```
USAGE
  $ swaggerhub api:create OWNER/API_NAME/[VERSION] [--visibility public|private] (--published publish|unpublish
    -f <value>) [--setdefault ] [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to create on SwaggerHub

FLAGS
  -f, --file=<value>         (required) file location of API to create
  -h, --help                 Show CLI help.
      --published=<option>   [default: unpublish] sets the lifecycle setting of the API version
                             <options: publish|unpublish>
      --setdefault           sets API version to be the default
      --visibility=<option>  [default: private] visibility of API in SwaggerHub
                             <options: public|private>

DESCRIPTION
  creates a new API / API version from a YAML/JSON file
  The API version from the file will be used unless the version is specified in the command argument.
  An error will occur if the API version already exists.


EXAMPLES
  $ swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public

  $ swaggerhub api:create organization/api --file api.yaml

  $ swaggerhub api:create organization/api/1.0.0 --published=publish --file api.json

  $ swaggerhub api:create organization/api/1.0.0 --setdefault --file api.json

  $ swaggerhub api:create organization/api/1.0.0 --published=publish --setdefault --file api.json
```

_See code: [src/commands/api/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/create.js)_

## `swaggerhub api:delete`

delete an API or API version

```
USAGE
  $ swaggerhub api:delete OWNER/API_NAME/[VERSION] [-f] [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to delete on SwaggerHub

FLAGS
  -f, --force  delete API without prompting for confirmation
  -h, --help   Show CLI help.

DESCRIPTION
  delete an API or API version


EXAMPLES
  $ swaggerhub api:delete organization/api/1.0.0

  $ swaggerhub api:delete organization/api

  $ swaggerhub api:delete organization/api --force
```

_See code: [src/commands/api/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/delete.js)_

## `swaggerhub api:get`

fetches an API definition

```
USAGE
  $ swaggerhub api:get OWNER/API_NAME/[VERSION] [-j] [-r] [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to fetch from Swaggerhub

FLAGS
  -h, --help      Show CLI help.
  -j, --json      returns the API in JSON format.
  -r, --resolved  gets the resolved API definition (supported in v1.25+).

DESCRIPTION
  fetches an API definition
  When VERSION is not included in the argument, the default version will be returned.
  Returns the API in YAML format by default.


EXAMPLES
  $ swaggerhub api:get organization/api

  $ swaggerhub api:get organization/api/1.0.0 --json
```

_See code: [src/commands/api/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/get.js)_

## `swaggerhub api:publish`

publish an API version

```
USAGE
  $ swaggerhub api:publish OWNER/API_NAME/VERSION [-f] [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION  API to publish on Swaggerhub

FLAGS
  -f, --force  publish API without prompting for confirmation
  -h, --help   Show CLI help.

DESCRIPTION
  publish an API version

EXAMPLES
  $ swaggerhub api:publish organization/api/1.0.0

  $ swaggerhub api:publish organization/api/1.0.0 --force
```

_See code: [src/commands/api/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/publish.js)_

## `swaggerhub api:setdefault`

set the default version of an API

```
USAGE
  $ swaggerhub api:setdefault OWNER/API_NAME/VERSION [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION  API to set as default on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  set the default version of an API

EXAMPLES
  $ swaggerhub api:setdefault organization/api/2.0.0
```

_See code: [src/commands/api/setdefault.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/setdefault.js)_

## `swaggerhub api:unpublish`

unpublish an API version

```
USAGE
  $ swaggerhub api:unpublish OWNER/API_NAME/VERSION [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION  API identifier

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  unpublish an API version

EXAMPLES
  $ swaggerhub api:unpublish organization/api/1.0.0
```

_See code: [src/commands/api/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/unpublish.js)_

## `swaggerhub api:update`

update an API

```
USAGE
  $ swaggerhub api:update OWNER/API_NAME/[VERSION] [-f <value>] [--visibility public|private] [--published
    publish|unpublish] [--setdefault] [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to update on SwaggerHub

FLAGS
  -f, --file=<value>         file location of API to update
  -h, --help                 Show CLI help.
      --published=<option>   sets the lifecycle setting of the API version
                             <options: publish|unpublish>
      --setdefault           sets API version to be the default
      --visibility=<option>  visibility of API in SwaggerHub
                             <options: public|private>

DESCRIPTION
  update an API
  The API version from the file will be used unless the version is specified in the command argument.
  When no file is specified then the default API version will be updated.
  The API visibility can be changed by using visibility flag.


EXAMPLES
  $ swaggerhub api:update organization/api --file api.yaml

  $ swaggerhub api:update organization/api/1.0.0 --file api.json

  $ swaggerhub api:update organization/api/1.0.0 --published=publish --file api.json

  $ swaggerhub api:update organization/api/1.0.0 --setdefault --file api.json

  $ swaggerhub api:update organization/api/1.0.0 --published=unpublish --setdefault --file api.json

  $ swaggerhub api:update organization/api/1.0.0 --visibility=private
```

_See code: [src/commands/api/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/update.js)_

## `swaggerhub api:validate`

Get validation result for an API version

```
USAGE
  $ swaggerhub api:validate OWNER/API_NAME/[VERSION] [-c] [-j] [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to fetch validation errors for from Swaggerhub

FLAGS
  -c, --fail-on-critical  Exit with error code 1 if there are critical standardization errors present
  -h, --help              Show CLI help.
  -j, --json              Print output in JSON instead of table format

DESCRIPTION
  Get validation result for an API version
  When VERSION is not included in the argument, the default version will be validated.
  An error will occur if the API version does not exist.
  If the flag `-c` or `--failOnCritical` is used and there are standardization
  errors with `Critical` severity present, the command will exit with error code `1`.


EXAMPLES
  $ swaggerhub api:validate organization/api/1.0.0

  $ swaggerhub api:validate -c -j organization/api/1.0.0

  $ swaggerhub api:validate --fail-on-critical --json organization/api
```

_See code: [src/commands/api/validate/index.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/validate/index.js)_

## `swaggerhub api:validate:download-rules`

Get existing SwaggerHub's organization standardization ruleset.

```
USAGE
  $ swaggerhub api:validate:download-rules OWNER [-s] [-d] [-h]

ARGUMENTS
  OWNER  Which organization standardization rules to fetch from SwaggerHub

FLAGS
  -d, --include-disabled-rules  Includes disabled rules in fetched organization's ruleset
  -h, --help                    Show CLI help.
  -s, --include-system-rules    Includes system rules in fetched organization's ruleset

DESCRIPTION
  Get existing SwaggerHub's organization standardization ruleset.
  Requires organization name argument. An error will occur if provided organization doesn't exist
  or your account is not permitted to access that organization's settings.
  If the flag `-s` or `--include-system-rules` is used, the returned ruleset will also include SwaggerHub system rules.
  If the flag `-d` or `--include-disabled-rules` is used, the returned ruleset will also include disabled custom rules

EXAMPLES
  $ swaggerhub api:validate:download-rules myOrg -s

  $ swaggerhub api:validate:download-rules myOrg --include-disabled-rules -s
```

_See code: [src/commands/api/validate/download-rules.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/validate/download-rules.js)_

## `swaggerhub api:validate:local`

Runs a scan against a local API definition using the organization's standardization configuration on SwaggerHub.

```
USAGE
  $ swaggerhub api:validate:local -f <value> -o <value> [-c] [-j] [-h]

FLAGS
  -c, --fail-on-critical      Exit with error code 1 if there are critical standardization errors present
  -f, --file=<value>          (required) Path of API definition file to run scan against
  -h, --help                  Show CLI help.
  -j, --json                  Print output in JSON instead of table format
  -o, --organization=<value>  (required) Which organization's standardization settings to use for linting the target
                              definition

DESCRIPTION
  Runs a scan against a local API definition using the organization's standardization configuration on SwaggerHub.
  If the flag `-c` or `--failOnCritical` is used and there are standardization
  errors with `Critical` severity present, the command will exit with error code `1`.


EXAMPLES
  $ swaggerhub api:validate:local -o myOrg -f ./my-api.yaml -c -j 

  $ swaggerhub api:validate:local --organization myOrg --file ./my-api/json --fail-on-critical --json
```

_See code: [src/commands/api/validate/local.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/api/validate/local.js)_

## `swaggerhub configure`

configure application settings

```
USAGE
  $ swaggerhub configure [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  configure application settings
  Enter the SwaggerHub URL - default is https://api.swaggerhub.com
  Customers with on-premise installations need to point this to their on-premise API, which is
  http(s)://{swaggerhub-host}/v1
  Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
  You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config
  settings.
```

_See code: [src/commands/configure.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/configure.js)_

## `swaggerhub domain:create`

creates a new domain / domain version from a YAML/JSON file

```
USAGE
  $ swaggerhub domain:create OWNER/DOMAIN_NAME/[VERSION] [--visibility public|private] (--published
    publish|unpublish -f <value>) [--setdefault ] [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  Domain to create on SwaggerHub

FLAGS
  -f, --file=<value>         (required) file location of domain to create
  -h, --help                 Show CLI help.
      --published=<option>   [default: unpublish] sets the lifecycle setting of the domain version
                             <options: publish|unpublish>
      --setdefault           sets domain version to be the default
      --visibility=<option>  [default: private] visibility of domain in SwaggerHub
                             <options: public|private>

DESCRIPTION
  creates a new domain / domain version from a YAML/JSON file
  The domain version from the file will be used unless the version is specified in the command argument.
  An error will occur if the domain version already exists.


EXAMPLES
  $ swaggerhub domain:create organization/domain/1.0.0 --file domain.yaml --visibility public

  $ swaggerhub domain:create organization/domain --file domain.yaml

  $ swaggerhub domain:create organization/domain/1.0.0 --publish --file domain.json

  $ swaggerhub domain:create organization/domain/1.0.0 --setdefault --file domain.json

  $ swaggerhub domain:create organization/domain/1.0.0 --publish --setdefault --file domain.json
```

_See code: [src/commands/domain/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/create.js)_

## `swaggerhub domain:delete`

delete a domain or domain version

```
USAGE
  $ swaggerhub domain:delete OWNER/DOMAIN_NAME/[VERSION] [-f] [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  Domain to delete on SwaggerHub

FLAGS
  -f, --force  delete domain without prompting for confirmation
  -h, --help   Show CLI help.

DESCRIPTION
  delete a domain or domain version


EXAMPLES
  $ swaggerhub domain:delete organization/domain/1.0.0

  $ swaggerhub domain:delete organization/domain

  $ swaggerhub domain:delete organization/domain --force
```

_See code: [src/commands/domain/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/delete.js)_

## `swaggerhub domain:get`

fetches a domain definition

```
USAGE
  $ swaggerhub domain:get OWNER/DOMAIN_NAME/[VERSION] [-j] [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  Domain to fetch from SwaggerHub

FLAGS
  -h, --help  Show CLI help.
  -j, --json  returns the domain in JSON format.

DESCRIPTION
  fetches a domain definition
  When VERSION is not included in the argument, the default version will be returned.
  Returns the domain in YAML format by default.


EXAMPLES
  $ swaggerhub domain:get organization/domain

  $ swaggerhub domain:get organization/domain/1.0.0 --json
```

_See code: [src/commands/domain/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/get.js)_

## `swaggerhub domain:publish`

publish a domain version

```
USAGE
  $ swaggerhub domain:publish OWNER/DOMAIN_NAME/VERSION [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/VERSION  Domain to publish on SwaggerHub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  publish a domain version

EXAMPLES
  $ swaggerhub domain:publish organization/domain/1.0.0
```

_See code: [src/commands/domain/publish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/publish.js)_

## `swaggerhub domain:setdefault`

set the default version of a domain

```
USAGE
  $ swaggerhub domain:setdefault OWNER/DOMAIN_NAME/VERSION [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/VERSION  Domain to set as default on SwaggerHub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  set the default version of a domain

EXAMPLES
  $ swaggerhub domain:setdefault organization/domain/2.0.0
```

_See code: [src/commands/domain/setdefault.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/setdefault.js)_

## `swaggerhub domain:unpublish`

unpublish a domain version

```
USAGE
  $ swaggerhub domain:unpublish OWNER/DOMAIN_NAME/VERSION [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/VERSION  Domain to unpublish on SwaggerHub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  unpublish a domain version

EXAMPLES
  $ swaggerhub domain:unpublish organization/domain/1.0.0
```

_See code: [src/commands/domain/unpublish.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/unpublish.js)_

## `swaggerhub domain:update`

update a domain

```
USAGE
  $ swaggerhub domain:update OWNER/DOMAIN_NAME/[VERSION] [-f <value>] [--visibility public|private] [--published
    publish|unpublish] [--setdefault] [-h]

ARGUMENTS
  OWNER/DOMAIN_NAME/[VERSION]  Domain to update on SwaggerHub

FLAGS
  -f, --file=<value>         file location of domain to update
  -h, --help                 Show CLI help.
      --published=<option>   sets the lifecycle setting of the domain version
                             <options: publish|unpublish>
      --setdefault           sets domain version to be the default
      --visibility=<option>  visibility of domain in SwaggerHub
                             <options: public|private>

DESCRIPTION
  update a domain
  The domain version from the file will be used unless the version is specified in the command argument.
  When no file is specified then the default domain version will be updated.
  The domain visibility can be changed by using visibility flag.


EXAMPLES
  $ swaggerhub domain:update organization/domain --file domain.yaml

  $ swaggerhub domain:update organization/domain/1.0.0 --file domain.json

  $ swaggerhub domain:update organization/domain/1.0.0 --published=publish --file domain.json

  $ swaggerhub domain:update organization/domain/1.0.0 --setdefault --file domain.json

  $ swaggerhub domain:update organization/domain/1.0.0 --published=unpublish --setdefault --file domain.json

  $ swaggerhub domain:update organization/domain/1.0.0 --visibility=private
```

_See code: [src/commands/domain/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/domain/update.js)_

## `swaggerhub help`

Display help for swaggerhub.

```
USAGE
  $ swaggerhub help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for swaggerhub.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.22/src/commands/help.ts)_

## `swaggerhub integration:create`

creates a new API integration from a JSON configuration file.

```
USAGE
  $ swaggerhub integration:create OWNER/API_NAME/[VERSION] -f <value> [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to add integration to on SwaggerHub

FLAGS
  -f, --file=<value>  (required) location of integration configuration file
  -h, --help          Show CLI help.

DESCRIPTION
  creates a new API integration from a JSON configuration file.
  See the documentation for configuration files:
  https://github.com/SmartBear/swaggerhub-cli/tree/main/examples/integrations
  When VERSION is not included in the argument, the integration will be added to be default API version.


EXAMPLES
  $ swaggerhub integration:create organization/api/1.0.0 --file config.json
```

_See code: [src/commands/integration/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/integration/create.js)_

## `swaggerhub integration:delete`

deletes the integration from the given API.

```
USAGE
  $ swaggerhub integration:delete OWNER/API_NAME/VERSION/INTEGRATION_ID [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to delete for given API on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  deletes the integration from the given API.

EXAMPLES
  $ swaggerhub integration:delete organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704
```

_See code: [src/commands/integration/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/integration/delete.js)_

## `swaggerhub integration:execute`

executes an integration for the given API.

```
USAGE
  $ swaggerhub integration:execute OWNER/API_NAME/VERSION/INTEGRATION_ID [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to execute for given API on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  executes an integration for the given API.

EXAMPLES
  $ swaggerhub integration:execute organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704
```

_See code: [src/commands/integration/execute.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/integration/execute.js)_

## `swaggerhub integration:get`

retieves an integration for the given API.

```
USAGE
  $ swaggerhub integration:get OWNER/API_NAME/VERSION/INTEGRATION_ID [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to fetch for given API on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  retieves an integration for the given API.

EXAMPLES
  $ swaggerhub integration:get organization/api/1.0.0/503c2db6-448a-4678-a310-f465429e9704
```

_See code: [src/commands/integration/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/integration/get.js)_

## `swaggerhub integration:list`

list integrations on an API.

```
USAGE
  $ swaggerhub integration:list OWNER/API_NAME/[VERSION] [-h]

ARGUMENTS
  OWNER/API_NAME/[VERSION]  API to list integrations for on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  list integrations on an API.

EXAMPLES
  $ swaggerhub integration:list organization/api/1.0.0
```

_See code: [src/commands/integration/list.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/integration/list.js)_

## `swaggerhub integration:update`

update the configuration of an API integration.

```
USAGE
  $ swaggerhub integration:update OWNER/API_NAME/VERSION/INTEGRATION_ID -f <value> [-h]

ARGUMENTS
  OWNER/API_NAME/VERSION/INTEGRATION_ID  Integration to update for given API on Swaggerhub

FLAGS
  -f, --file=<value>  (required) location of integration configuration file
  -h, --help          Show CLI help.

DESCRIPTION
  update the configuration of an API integration.

EXAMPLES
  $ swaggerhub integration:update organization/api/1.0.0/503c2db6-448a-4678-abcd-0123456789abc --file config.json
```

_See code: [src/commands/integration/update.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/integration/update.js)_

## `swaggerhub plugins`

List installed plugins.

```
USAGE
  $ swaggerhub plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ swaggerhub plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/index.ts)_

## `swaggerhub plugins:add`

Installs a plugin into swaggerhub.

```
USAGE
  $ swaggerhub plugins:add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into swaggerhub.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SWAGGERHUB_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SWAGGERHUB_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ swaggerhub plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ swaggerhub plugins:add myplugin

  Install a plugin from a github url.

    $ swaggerhub plugins:add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ swaggerhub plugins:add someuser/someplugin
```

## `swaggerhub plugins:inspect`

Displays installation properties of a plugin.

```
USAGE
  $ swaggerhub plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ swaggerhub plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/inspect.ts)_

## `swaggerhub plugins:install`

Installs a plugin into swaggerhub.

```
USAGE
  $ swaggerhub plugins:install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into swaggerhub.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SWAGGERHUB_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SWAGGERHUB_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ swaggerhub plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ swaggerhub plugins:install myplugin

  Install a plugin from a github url.

    $ swaggerhub plugins:install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ swaggerhub plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/install.ts)_

## `swaggerhub plugins:link`

Links a plugin into the CLI for development.

```
USAGE
  $ swaggerhub plugins:link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ swaggerhub plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/link.ts)_

## `swaggerhub plugins:remove`

Removes a plugin from the CLI.

```
USAGE
  $ swaggerhub plugins:remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ swaggerhub plugins:unlink
  $ swaggerhub plugins:remove

EXAMPLES
  $ swaggerhub plugins:remove myplugin
```

## `swaggerhub plugins:reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ swaggerhub plugins:reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/reset.ts)_

## `swaggerhub plugins:uninstall`

Removes a plugin from the CLI.

```
USAGE
  $ swaggerhub plugins:uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ swaggerhub plugins:unlink
  $ swaggerhub plugins:remove

EXAMPLES
  $ swaggerhub plugins:uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/uninstall.ts)_

## `swaggerhub plugins:unlink`

Removes a plugin from the CLI.

```
USAGE
  $ swaggerhub plugins:unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ swaggerhub plugins:unlink
  $ swaggerhub plugins:remove

EXAMPLES
  $ swaggerhub plugins:unlink myplugin
```

## `swaggerhub plugins:update`

Update installed plugins.

```
USAGE
  $ swaggerhub plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/update.ts)_

## `swaggerhub project:api:add`

Adds an API to an existing project.

```
USAGE
  $ swaggerhub project:api:add OWNER/PROJECT_NAME API [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The project to add the API to on Swaggerhub
  API                 The name of the API on Swaggerhub to add

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Adds an API to an existing project.

EXAMPLES
  $ swaggerhub project:api:add organization/project_name my_api
```

_See code: [src/commands/project/api/add.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/api/add.js)_

## `swaggerhub project:api:remove`

Removes an API from a project in SwaggerHub.

```
USAGE
  $ swaggerhub project:api:remove OWNER/PROJECT_NAME API [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The project to remove the API from on Swaggerhub
  API                 The name of the API on Swaggerhub to remove

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Removes an API from a project in SwaggerHub.

EXAMPLES
  $ swaggerhub project:api:remove organization/project_name my_api
```

_See code: [src/commands/project/api/remove.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/api/remove.js)_

## `swaggerhub project:create`

Creates a new project in SwaggerHub.

```
USAGE
  $ swaggerhub project:create OWNER/PROJECT_NAME [--description <value>] [-a <value>] [-d <value>] [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The new project to create on Swaggerhub

FLAGS
  -a, --apis=<value>         Comma separated list of api names to include in project
  -d, --domains=<value>      Comma separated list of domain names to include in project
  -h, --help                 Show CLI help.
      --description=<value>  Description of project

DESCRIPTION
  Creates a new project in SwaggerHub.

EXAMPLES
  $ swaggerhub project:create organization/new_project_name --description "project description"

  $ swaggerhub project:create organization/new_project_name -a "testapi1,testapi2"

  $ swaggerhub project:create organization/new_project_name --apis "testapi1,testapi2"

  $ swaggerhub project:create organization/new_project_name -d "testdomain3,testdomain4"

  $ swaggerhub project:create organization/new_project_name --domains "testdomain3,testdomain4"

  $ swaggerhub project:create organization/new_project_name -a "testapi1" -d "testdomain3" --description "description"
```

_See code: [src/commands/project/create.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/create.js)_

## `swaggerhub project:delete`

Deletes a project from SwaggerHub.

```
USAGE
  $ swaggerhub project:delete OWNER/PROJECT_NAME [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The project to delete on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Deletes a project from SwaggerHub.

EXAMPLES
  $ swaggerhub project:delete organization/project_name
```

_See code: [src/commands/project/delete.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/delete.js)_

## `swaggerhub project:domain:add`

Adds a domain to an existing project.

```
USAGE
  $ swaggerhub project:domain:add OWNER/PROJECT_NAME DOMAIN [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The project to add the domain to on Swaggerhub
  DOMAIN              The name of the domain on Swaggerhub to add

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Adds a domain to an existing project.

EXAMPLES
  $ swaggerhub project:domain:add organization/project_name my_domain
```

_See code: [src/commands/project/domain/add.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/domain/add.js)_

## `swaggerhub project:domain:remove`

Removes a domain from a project in SwaggerHub.

```
USAGE
  $ swaggerhub project:domain:remove OWNER/PROJECT_NAME DOMAIN [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The project to remove the domain from on Swaggerhub
  DOMAIN              The name of the domain on Swaggerhub to remove

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Removes a domain from a project in SwaggerHub.

EXAMPLES
  $ swaggerhub project:domain:remove organization/project_name my_domain
```

_See code: [src/commands/project/domain/remove.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/domain/remove.js)_

## `swaggerhub project:get`

Retrieves the details for a project.

```
USAGE
  $ swaggerhub project:get OWNER/PROJECT_NAME [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  The project to get details for on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Retrieves the details for a project.

EXAMPLES
  $ swaggerhub project:get organization/project_name
```

_See code: [src/commands/project/get.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/get.js)_

## `swaggerhub project:list`

list projects

```
USAGE
  $ swaggerhub project:list [OWNER] [-h]

ARGUMENTS
  OWNER  The organization to list projects for on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  list projects

EXAMPLES
  $ swaggerhub project:list

  $ swaggerhub project:list organization
```

_See code: [src/commands/project/list.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/list.js)_

## `swaggerhub project:member:list`

list members of a project

```
USAGE
  $ swaggerhub project:member:list OWNER/PROJECT_NAME [-h]

ARGUMENTS
  OWNER/PROJECT_NAME  Project to list members of on Swaggerhub

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  list members of a project

EXAMPLES
  $ swaggerhub project:member:list organisation/project_name
```

_See code: [src/commands/project/member/list.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/project/member/list.js)_

## `swaggerhub spectral:upload`

Create or update organization's Spectral ruleset

```
USAGE
  $ swaggerhub spectral:upload OWNER/RULESET_NAME/VERSION directory [-h]

ARGUMENTS
  OWNER/RULESET_NAME/[VERSION]  The Spectral ruleset details for SwaggerHub organization
  directory                     Relative path to directory with ruleset files

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Create or update organization's Spectral ruleset

EXAMPLES
  $ swaggerhub spectral:upload my_organization/my_api_ruleset/1.0.0 rules
```

_See code: [src/commands/spectral/upload.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/spectral/upload.js)_


## `swaggerhub spectral:download`

Fetch organization's Spectral ruleset

```
USAGE
  $ swaggerhub spectral:download OWNER/RULESET_NAME/VERSION directory [-h]

ARGUMENTS
  OWNER/RULESET_NAME/[VERSION]  The Spectral ruleset details for SwaggerHub organization
  directory                     Relative path to directory the ruleset files should be saved to

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Fetch organization's Spectral ruleset

EXAMPLES
  $ swaggerhub spectral:download my_organization/my_api_ruleset/1.0.0 rules
```

_See code: [src/commands/spectral/download.js](https://github.com/SmartBear/swaggerhub-cli/blob/v0.9.1/src/commands/spectral/download.js)_
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
