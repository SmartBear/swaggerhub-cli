---
name: swaggerhub-cli
description: Use the Swagger CLI (`swaggerhub`) to manage APIs, domains, projects, integrations and Spectral rulesets in Swagger (SwaggerHub) from the terminal or CI. Use when asked to fetch, create, update, clone, publish, validate or delete an API or domain definition on Swagger.
---

# Swagger CLI (`swaggerhub`)

Install: `npm i -g swaggerhub-cli` (Node.js >= 22.9). Run `swaggerhub <command> --help` for exact flags; it is the source of truth.

## Authentication

Set `SWAGGERHUB_API_KEY` (required). For Swagger Studio On-Premise 2.x also set `SWAGGERHUB_URL=https://<host>/v1`. Never print or commit the key. Alternatively `swaggerhub configure` (interactive, so avoid it in non-interactive agent runs; use env vars).

## Identifiers

- API / domain: `OWNER/NAME/VERSION` (VERSION optional on get/update/delete/validate; the default version is used).
- Project: `OWNER/PROJECT_NAME`.
- Integration: `OWNER/API_NAME/VERSION/INTEGRATION_ID`.

## Common tasks

```sh
swaggerhub api:get org/api/1.0.0 --json            # YAML by default; -r for resolved definition
swaggerhub api:create org/api/1.0.0 -f api.yaml    # errors if the version already exists
swaggerhub api:update org/api/1.0.0 -f api.yaml    # --published=publish|unpublish, --setdefault, --visibility
swaggerhub api:clone org/api/1.0.0 1.0.1
swaggerhub api:publish org/api/1.0.0 --force       # --force skips the confirmation prompt
swaggerhub api:validate org/api/1.0.0 -c -j        # -c exits 1 on critical errors, -j prints JSON
swaggerhub api:validate:local -o org -f api.yaml -c
swaggerhub project:list org
```

The `domain:*` commands mirror `api:*` (get, create, update, clone, publish, unpublish, setdefault, rename, delete). Other groups: `project:*` (create, get, list, delete, api/domain add/remove, member:list), `integration:*` (create, get, list, update, delete, execute), `spectral:download|upload`. Use `swaggerhub help` to list everything.

## Guidance for agents

- Commands that prompt for confirmation (`api:publish`, `api:delete`, and their domain equivalents) hang without a TTY. Pass `--force`/`-f` only after the user has agreed to the action.
- Deletes, publishes and unpublishes affect shared, live resources. Confirm with the user before running them, and prefer `api:get` first to check the target exists.
- Prefer `--json` where available for output you need to parse.
- To edit a definition: `api:get` to a file, modify it, then `api:update -f`. Run `api:validate:local` before publishing.
- A non-zero exit code means failure; read stderr rather than retrying blindly.
