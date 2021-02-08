# SwaggerHub CLI Integrations

Integrations are created for an API using the `integration:create` command. The command takes a configuration file for the integration settings. Each integration has a different set of properties that can be configured.

**Note:** SwaggerHub On-Premise users need v. 1.26 to use the `integration:create` command.

* [API Auto Mocking Integration](#api-auto-mocking-integration)
* [GitHub Integration](#github-integration)
* [GitHub Enterprise Integration](#github-enterprise-integration)
* [Azure DevOps Server Integration](#azure-devops-server-integration)
* [Azure DevOps Services Integration](#azure-devops-services-integration)
* [Bitbucket Cloud Integration](#bitbucket-cloud-integration)
* [Bitbucket Server Integration](#bitbucket-server-integration)
* [GitLab Integration](#gitlab-integration)
* [Webhook Integration](#webhook-integration)

## API Auto Mocking Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "API_AUTO_MOCKING" is used to create an API Auto Mocking integration.
* **defaultResponseType**: Response content type that the server will return if no `Accept` header is specified. Options are: `application/json`, `application/xml`, `application/yaml`. Default value is "application/json".
* **token**: Bearer token that users will need to send in requests to the mock server (private APIs only). This property is optional.
* **modify**: Whether to update the `host`/`servers` in the API definition for the API Auto Mock server. Default value is `true`.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## GitHub Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "GITHUB" is used to create a GitHub integration.
* **token**: Personal access token for accessing the repository. Tokens can be generated here: https://github.com/settings/tokens. The token must have the _public_repo_ scope if the target repository is public, or the _repo_ scope if it is private.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## GitHub Enterprise Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "GITHUB_ENTERPRISE" is used to create a GitHub Enterprise integration.
* **host**:  URL of your GitHub Enterprise server, for example, https://ghe.example.com.
* **token**: [Personal access token](https://docs.github.com/en/enterprise/user/github/authenticating-to-github/creating-a-personal-access-token) for accessing the repository. The token must have the _public_repo_ scope if the target repository is public, or the _repo_ scope if it is private.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## Azure DevOps Server Integration

**Note:** This integration is available in SwaggerHub On-Premise only.

* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "AZURE_DEVOPS_SERVER" is used to create an Azure DevOps Server integration.
* **url**: Azure DevOps Server host, typically `http(s)://server[:port]/tfs`
* **personalAccessToken**: Personal access token for accessing the repository. The token must have _Code (read and write)_ scope.
* **projectCollection**: Project collection which contains the target repository's project.
* **project**: Team Project which contains the target repository.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## Azure DevOps Services Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "AZURE_DEVOPS_SERVICES" is used to create an Azure DevOps Service integration.
* **personalAccessToken**: [Personal access token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat) for accessing the target repository. The token must have _Code > Read & write_ scope.
* **organization**: The Azure DevOps organization that contains the target repository.
* **project**: Team Project which contains the target repository.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## Bitbucket Cloud Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "BITBUCKET_CLOUD" is used to create a Bitbucket Cloud integration.
* **username**: Bitbucket username.
* **password**: Bitbucket app password. Required permissions are: Account: Email, Read; Repositories: Read, Write.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## Bitbucket Server Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "BITBUCKET_SERVER" is used to create a Bitbucket Server integration.
* **host**: URL of the Bitbucket Server host.
* **username**: Account username.
* **password**: Account password.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## GitLab Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "GITLAB" is used to create a GitLab integration.
* **host**: URL of the GitLab host. Default value is https://gitlab.com.
* **personalAccessToken**: A personal access token for accessing the target repository. The token must have the _api_ scope.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFolder**: The output folder for the generated code or definition.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **enabled**: Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.

## Webhook Integration
* **name**: Display name of the integration. Must be unique among all integrations configured for the given API version.
* **configType**: "WEBHOOK" is used to create a Webhook integration.
* **url**: URL to send notification.
* **contentType**: Content type of notification. Must be "application/json" or "application/x-www-form-urlencoded".
* **lifecycleEvents**: The lifecycle events that will trigger webhook. This is a list from the options: "API_SAVED", "API_PUBLISHED".
* **additionalHeaders**: Custom HTTP headers to be sent with webhook notifications. Use the format "name: value" for each header.

## Property: `target`
In the case of source control management (SCM) integrations, it is possible to generate server stubs, client SDKs, or resolved versions of the API. The value of `target` defines the generated output. The list of targets varies between OpenAPI 2.0 and OpenAPI 3.0 definitions. The current list of options is displayed below.

### OpenAPI 2.0
* API: "YAML (Unresolved)", "YAML (Resolved)", "JSON (Unresolved)", "JSON (Resolved)"

* Servers: "aspnetcore", "erlang-server", "go-server", "haskell", "inflector", "jaxrs", "jaxrs-cxf", "jaxrs-cxf-cdi", "jaxrs-resteasy", "jaxrs-spec", "lumen", "msf4j", "nancyfx", "nodejs-server", "php-silex", "php-symfony", "pistache-server", "python-flask", "rails5", "restbed", "rust-server", "scalatra", "sinatra", "slim", "spring", "undertow"

* Clients: "akka-scala", "android", "apex", "clojure", "cpprest", "csharp", "csharp-dotnet2", "cwiki", "dart", "dynamic-html", "flash", "go", "groovy", "html", "html2", "java", "javascript", "javascript-closure-angular", "jaxrs-cxf-client", "jmeter", "kotlin", "objc", "perl", "php", "python", "qt5cpp", "ruby", "scala", "scala-gatling", "swagger", "swagger-yaml", "swift", "swift3", "swift4", "swift5", "tizen", "typescript-angular", "typescript-angularjs", "typescript-fetch", "typescript-inversify", "typescript-node"

### OpenAPI 3.0
* API: "YAML (Unresolved)", "YAML (Resolved)", "JSON (Unresolved)", "JSON (Resolved)"
* Servers: "aspnetcore", "go-server", "inflector", "jaxrs-jersey", "jaxrs-resteasy", "jaxrs-resteasy-eap", "nodejs-server", "python-flask", "scala-akka-http-server", "spring"
* Clients: "csharp", "dynamic-html", "go", "html", "html2", "java", "jaxrs-cxf-client", "kotlin-client", "openapi", "openapi-yaml", "php", "python", "scala", "swift3", "swift4", "swift5", "typescript-angular", "typescript-fetch"


## Property: `syncMethod`
### Basic Sync
Basic Sync will manage files and folders in the output folder. New and edited files will be updated in the repository, existing files will not be modified.
### Advanced Sync
Allows you to define which files and folders will be managed by SwaggerHub.\
When Advanced Sync is used the following properties can be set
  * **providedPaths**: Partially Managed Paths - files in these locations will be created if they do not exist. Existing files will not be modified.
  * **managedPaths**: Fully Managed Paths - files in these locations will be fully managed by SwaggerHub. All files will be overwritten and existing files may be deleted if not needed.
  * **ignoredPaths**: Ignored Paths - these files will not be changed.
  
 Paths are relative to the `outputFolder`. Here is an example of an Advanced Sync configuration:
 ```
   "providedPaths": [
       "*"
   ],
   "managedPaths": [
       "api/*", "controllers/Pet.js"
   ],
   "ignoredPaths": [
       "README.md"
   ]
 ```
