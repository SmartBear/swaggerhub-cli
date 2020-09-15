# SwaggerHub CLI Integrations

Integrations are created for an API using the `integration:create` command. The command takes a configuration file for the integration settings. Each integration has a different set of properties that can be configured.


## GitHub Integration
* **name**: Name of the integration
* **configType**: "GITHUB" is used to create a GitHub Integration.
* **token**: Personal access token for accessing the repository. Tokens can generated here: https://github.com/settings/tokens.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. (Must not contain whitespace characters).
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **outputFolder**: The output folder for the generated code or definition.
* **enabled**: Set whether the integration can be executed. Default value is `true`.


## GitHub Enterprise Integration
* **name**: Name of the integration
* **configType**: "GITHUB_ENTERPRISE" is used to create a GitHub Enterprise Integration.
* **host**:  The URL of your GitHub Enterprise server, for example, https://ghe.mycompany.com
* **token**: Personal access token for accessing the repository. Tokens can be generated on: https://<github-host>/settings/tokens.
* **owner**: Owner of the repository to synchronize.
* **repository**: Repository to synchronize.
* **syncMethod**: "Basic Sync" or "Advanced Sync". See [*Property: `syncMethod`*](#property-syncmethod) for details.
* **branch**: The branch to synchronize. If it does not exist, it will be created based on your default branch. (Must not contain whitespace characters).
* **target**: The type of code to generate and push to the repository. See [*Property: `target`*](#property-target) for details.
* **outputFile**: If target is the YAML/JSON definiton, this is the filename for the generated definition.
* **outputFolder**: The output folder for the generated code or definition.
* **enabled**: Set whether the integration can be executed. Default value is `true`.


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
* **Basic Sync**: Sync will manage all files and folders in the branch.
* **Advanced Sync**: Allows you to define which files and folders will be managed by SwaggerHub.\
When Advanced Sync is used the following properties can be set
  * providedPaths: Partially Managed Paths - files in these locations will be created only if they do not exist. Existing files will not be modified.
  * managedPaths: Fully Managed Paths - files in these locations will be fully managed by SwaggerHub. All files will be overwritten and existing files may be deleted if not needed.
  * ignoredPaths: Ignored Paths - these files will not be changed.
  
  Paths are relative to the `outputFolder`. Here is an example Advanced Sync configuration:
  ```
    "providedPaths": [
        "*"
    ],
    "managedPaths": [
        "api/*", "controllers/Pet.js"
    ],
    "ignoredPath": [
        "README.md"
    ]
  ```
