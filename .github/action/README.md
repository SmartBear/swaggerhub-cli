# SwaggerHub CLI GitHub Action

Enable your CI/CD pipelines to manage the API definition lifecycle using the SwaggerHub CLI.

## Usage

### Inputs and Configuration

| Name   | Description                     |
|--------|---------------------------------|
| `args` | Command to be passed to the CLI | 

### Output

| Name       | Description           |
|------------|-----------------------|
| `response` | Response from the CLI | 

## Examples

### Update API

```yaml
name: Push API
on:
  push:
    branches:
      - develop
      
env:
  SWAGGERHUB_API_KEY: ${{ secrets.SWAGGERHUB_API_KEY }}
jobs:
  build:
    runs-on: ubuntu-latest
    name: Update SwaggerHub
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Call CLI
      uses: smartbear/swaggerhub-cli@pr_demo
      with:
        args: api:update MyOrg/SimpleApi -f ./docs/api.yml

```

### Publish API Version

```yaml
name: Push API
on: [release]  
env:
  SWAGGERHUB_API_KEY: ${{ secrets.SWAGGERHUB_API_KEY }}
  SWAGGERHUB_URL: ${{ secrets.SWAGGERHUB_URL }}
jobs:
  build:
    runs-on: ubuntu-latest
    name: Update SwaggerHub
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Call CLI
      uses: smartbear/swaggerhub-cli@pr_demo
      with:
        args: api:publish MyOrg/SimpleApi -f ./docs/api.yml

```