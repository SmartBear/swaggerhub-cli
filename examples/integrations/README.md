# SwaggerHub CLI Integrations

Integrations are created for an API using the `integration:create` command. The command takes a configuration file for the integration settings. Each integration has a different set of properties that can be configured.

**Notes:** 
* SwaggerHub On-Premise users need v. 1.26 to use the `integration:create` command.
* Amazon API Gateway Integration is not supported yet in SwaggerHub On-Premise.

# Integrations

* [Amazon API Gateway Integration](#amazon-api-gateway-integration)
* [Amazon API Gateway Lambda Integration](#amazon-api-gateway-lambda-integration)
* [API Auto Mocking Integration](#api-auto-mocking-integration)
* [Apigee Edge Integration](#apigee-edge-integration)
* [Azure API Management Integration](#azure-api-management-integration)
* [Azure DevOps Server Integration](#azure-devops-server-integration)
* [Azure DevOps Services Integration](#azure-devops-services-integration)
* [Bitbucket Cloud Integration](#bitbucket-cloud-integration)
* [Bitbucket Server Integration](#bitbucket-server-integration)
* [GitHub Enterprise Integration](#github-enterprise-integration)
* [GitHub Integration](#github-integration)
* [GitLab Integration](#gitlab-integration)
* [IBM API Connect Integration](#ibm-api-connect-integration)
* [Webhook Integration](#webhook-integration)

## Amazon API Gateway Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"AMAZON_API_GATEWAY" is used to create an Amazon API Gateway integration.|
|region|string|yes|AWS region where the API will be published. See [*Property: `region`*](#property-region) for options.|
|proxyToAddress|string|yes|The URL of the backend endpoint to which the API Gateway will proxy the requests.|
|accessKey|string|yes|AWS access key.|
|secretKey|string|yes|AWS secret key.|
|publishMode|string|no|How to update an existing API in AWS. Options are: `merge`, `overwrite`. Default value is `merge`.|
|basePathMode|string|no|How to handle the API's basePath value. Refer to [AWS documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api-basePath.html) for details. Options are `ignore`, `prepend`, `split`. Default value is `ignore`.|
|updateDefinition|boolean|no|Whether to update the API definition with Amazon-specific extensions and compatibility modifications. Default value is `false`.|
|deploymentMode|string|no|Should be `on save`. The value `never` means the integration is disabled. Default value is `on save`.|
|apiId|string|no|AWS ID of the API to update. Empty value will create a new API in AWS. This property is optional.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Amazon API Gateway Lambda Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"AMAZON_API_GATEWAY_LAMBDA" is used to create an Amazon API Gateway Lambda integration.|
|region|string|yes|AWS region where the API will be published. See [*Property: `region`*](#property-region) for options.|
|runtimeLanguage|string|no|The target runtime language to generate lambda functions. Options are: `nodejs12.x`, `nodejs10.x`, `python3.8`, `python3.7`, `python3.6`, `python2.7`. Default value is `nodejs12.x`.|
|lambdaRole|string|no|Execution role for creating non-existing Lambda Functions. If specified, missing lambda functions will be created using this role. Must be in the `arn:aws:iam::{ID}:role/{NAME}` format.|
|accessKey|string|yes|AWS access key.|
|secretKey|string|yes|AWS secret key.|
|publishMode|string|no|How to update an existing API in AWS. Options are: `merge`, `overwrite`. Default value is `merge`.|
|basePathMode|string|no|How to handle the API's basePath value. Refer to [AWS documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api-basePath.html) for details. Options are `ignore`, `prepend`, `split`. Default value is `ignore`.|
|updateDefinition|boolean|no|Whether to update the API definition with Amazon-specific extensions and compatibility modifications. Default value is `false`.|
|deploymentMode|string|no|Should be `on save`. The value `never` means the integration is disabled. Default value is `on save`.|
|apiId|string|no|AWS ID of the API to update. Empty value will create a new API in AWS. This property is optional.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## API Auto Mocking Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"API_AUTO_MOCKING" is used to create an API Auto Mocking integration.|
|defaultResponseType|string|no|Response content type that the server will return if no `Accept` header is specified. Options are: `application/json`, `application/xml`, `application/yaml`. Default value is "application/json".|
|token|string|no|Bearer token that users will need to send in requests to the mock server (private APIs only). This property is optional.|
|modify|boolean|no|Whether to update the `host`/`servers` in the API definition for the API Auto Mock server. Default value is `true`.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Apigee Edge Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"APIGEE_EDGE" is used to create an Apigee Edge integration.|
|email|string|yes|Apigee Edge email.|
|password|string|yes|Password for apigee account.|
|organization|string|yes|Organization where API will be saved.|
|apiName|string|yes|Name for the API that is going to be saved on your apigee account.|
|targetUrl|string|yes|Target endpoint for proxy.|
|host|string|no|Apigee Edge Management instance URL. If using an On-Premise deployment, enter the URL to your Edge instance. Default value is `https://api.enterprise.apigee.com/v1` for the cloud version of Apigee Edge.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Azure API Management Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"AZURE_API_MANAGEMENT" is used to create an Azure API Management integration.|
|serviceInstance|string|yes|The name of the Azure API Management service instance as it appears in the "All resources" list in the Azure portal.|
|token|string|yes|A personal access token for accessing the Azure API Management service. Documentation for generating tokens is [here.](https://docs.microsoft.com/en-us/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-authentication)|
|urlSuffix|string|no|API URL suffix in Azure API Management.|
|apiId|string|no|A unique identifier that allows you to connect your definition to an existing API. If left blank, a unique identifier will be added using an extension, x-azure-api-id. This value will be ignored if a value exists in the definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Azure DevOps Server Integration

**Note:** This integration is available in SwaggerHub On-Premise only.
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"AZURE_DEVOPS_SERVER" is used to create an Azure DevOps Server integration.|
|url|string|yes|Azure DevOps Server host, typically `http(s)://server[:port]/tfs`|
|personalAccessToken|string|yes|Personal access token for accessing the repository. The token must have _Code (read and write)_ scope.|
|projectCollection|string|yes|Project collection which contains the target repository's project.|
|project|string|yes|Team Project which contains the target repository.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Azure DevOps Services Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"AZURE_DEVOPS_SERVICES" is used to create an Azure DevOps Service integration.|
|personalAccessToken|string|yes|[Personal access token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat) for accessing the target repository. The token must have _Code > Read & write_ scope.|
|organization|string|yes|The Azure DevOps organization that contains the target repository.|
|project|string|yes|Team Project which contains the target repository.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Bitbucket Cloud Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"BITBUCKET_CLOUD" is used to create a Bitbucket Cloud integration.|
|username|string|yes|Bitbucket username.|
|password|string|yes|Bitbucket app password. Required permissions are: Account: Email, Read; Repositories: Read, Write.|
|owner|string|yes|Owner of the repository to synchronize.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Bitbucket Server Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"BITBUCKET_SERVER" is used to create a Bitbucket Server integration.|
|host|string|yes|URL of the Bitbucket Server host.|
|username|string|yes|Account username.|
|password|string|yes|Account password.|
|owner|string|yes|Owner of the repository to synchronize.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## GitHub Enterprise Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"GITHUB_ENTERPRISE" is used to create a GitHub Enterprise integration.|
|host|string|yes|URL of your GitHub Enterprise server, for example, https://ghe.example.com.|
|token|string|yes|Personal access token for accessing the repository. Tokens can be generated here: https://github.com/settings/tokens. The token must have the _public_repo_ scope if the target repository is public, or the _repo_ scope if it is private.|
|owner|string|yes|Owner of the repository to synchronize.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## GitHub Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"GITHUB" is used to create a GitHub integration.|
|token|string|yes|Personal access token for accessing the repository. Tokens can be generated here: https://github.com/settings/tokens. The token must have the _public_repo_ scope if the target repository is public, or the _repo_ scope if it is private.|
|owner|string|yes|Owner of the repository to synchronize.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## GitLab Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"GITLAB" is used to create a GitLab integration.|
|host|string|no|URL of the GitLab host. Default value is https://gitlab.com.|
|personalAccessToken|string|yes|A personal access token for accessing the target repository. The token must have the _api_ scope.|
|owner|string|yes|Owner of the repository to synchronize.|
|repository|string|yes|Repository to synchronize.|
|branch|string|yes|The branch to synchronize. If it does not exist, it will be created based on your default branch. Must not contain whitespace characters.|
|syncMethod|string|yes|"Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.|
|target|string|yes|The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.|
|outputFolder|string|yes|The output folder for the generated code or definition.|
|outputFile|string|no|If target is the YAML/JSON definiton, this is the filename for the generated definition.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## IBM API Connect Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"IBM_API_CONNECT" is used to create an IBM API Connect integration.|
|apiKey|string|yes|IBM Cloud API Key, obtain a key [here.](https://console.bluemix.net/iam#/apikeys)| 
|orgId|string|yes|The organization ID or name under your IBM Cloud account to which you want to deploy your API. Example value `680ee27a0cf28d61b4e9a462`.|
|apiId|string|no|The name of the API to publish to. If left blank, a new API in IBM will be created when the integration is triggered. When specified, any existing API definition will be overwritten.|
|enabled|boolean|no|Enables the integration, if set to `false` the integration will be saved but will not execute. Default value is `true`.|

## Webhook Integration
|Property|Type|Required|Description|
|-|-|-|-|
|name|string|yes|Display name of the integration. Must be unique among all integrations configured for the given API version.|
|configType|string|yes|"WEBHOOK" is used to create a Webhook integration.|
|url|string|yes|URL to send notification.|
|contentType|string|yes|Content type of notification. Must be "application/json" or "application/x-www-form-urlencoded".|
|lifecycleEvents|string|no|The lifecycle events that will trigger webhook. This is a list from the options: "API_SAVED", "API_PUBLISHED".|
|additionalHeaders|string|no|Custom HTTP headers to be sent with webhook notifications. Use the format "name: value" for each header.|

## Property: `region`
AWS region where the API will be published. 
Options are: `us-east-1`, `us-east-2`, `us-west-1`, `us-west-2`, `eu-west-1`, `eu-west-2`, `eu-west-3`, `eu-central-1`, `eu-north-1`, `ap-east-1`, `ap-south-1`, `ap-southeast-1`, `ap-southeast-2`, `ap-northeast-1`, `ap-northeast-2`, `sa-east-1`, `cn-north-1`, `cn-northwest-1`, `ca-central-1`, `me-south-1`.

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
