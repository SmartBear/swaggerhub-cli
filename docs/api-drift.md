# API drift: SwaggerHub Registry API vs this CLI

Last compared: 2026-10-30, Registry API `1.4.0`, CLI `0.13.0`.
Rows marked (?) came from a summarized read of the spec and still need checking against the raw JSON and the source.

## Gaps (API capability with no CLI command)

| Area | API endpoints | CLI status |
|---|---|---|
| Listing/search | `GET /specs`, `/apis/{owner}`, `/domains/{owner}`, `/apis`, `/domains` | none: no `api:list`, `domain:list` or search (biggest gap) |
| Versions | `GET /apis/{o}/{a}`, `/domains/{o}/{d}` | none |
| Fork / clone | `POST .../{version}/fork`, `.../clone` (APIs, domains) | clone **done**: `api:clone`, `domain:clone`; fork open |
| Domain rename | `POST /domains/{o}/{d}/rename` | **done**: `domain:rename` |
| Version delete | `DELETE /apis/{o}/{a}/{version}`, domains equivalent | (?) check `api:delete` / `domain:delete` |
| Visibility | `GET/PUT .../settings/private` | only via `--visibility` on create/update |
| Lifecycle / default read | `GET .../settings/lifecycle`, `.../settings/default` | write-only (`publish`, `setdefault`) |
| Comments | v2 CRUD, replies, status, batch (APIs, domains) | none |
| Templates | whole `/templates` family | none |
| Integrations | `PATCH .../integrations/{id}` | none (create/get/list/update/delete/execute exist) |
| Projects | `nameOnly` query on list; project update | (?) `project:list` lacks `--nameOnly` |
| Definition fetch | `flatten` query param | only `resolved` |
| Save | `force` query on save | (?) check create/update |

## Drift in the other direction (CLI uses things the spec does not list)

- `api:validate` falls back to `GET .../validation` only for on-prem <= 2.4.1 (intentional, see `src/commands/api/validate/index.js`); the spec also documents `POST /specs/validate`, which the CLI does not use.
- `project:member:list` calls `GET /projects/{o}/{p}/members`; not found in the spec paths. (?)

## Covered, no action
Spectral rulesets (`/standardization/spectral-rulesets/.../zip`), standardization errors (`.../standardization`).

## Not yet compared
Other public APIs (Portal, Explore, organizations/user management).

## Recipe to repeat the analysis

1. Fetch the spec:
   `curl -sL -H 'Accept: application/json' https://api.swaggerhub.com/apis/swagger-hub/registry-api/<version> -o registry.json`
   (current default version is listed at `https://api.swaggerhub.com/apis/swagger-hub/registry-api`).
2. List API operations:
   `jq -r '.paths | to_entries[] | .key as $p | .value | to_entries[] | select(.key|test("get|post|put|patch|delete")) | "\(.key|ascii_upcase) \($p) \(.value.operationId)"' registry.json | sort`
3. List what the CLI calls: every URL is built in `src/requests/*.js` (`getSpec/postSpec/putSpec/deleteSpec` with a resource such as `apis`, `domains`, `projects`) plus the `pathParams` and `queryParams` in `src/commands/**`:
   `grep -rnE "pathParams|queryParams|\[SWAGGERHUB_URL|getApi\(|getDomain\(|getProject\(|postApi|postDomain" src`
4. Diff both lists by method and path, then compare query parameters per operation against each command's `Flags`.
5. Check both directions: API operations missing in the CLI, and CLI calls missing from the spec (deprecated or undocumented).
6. Update the tables above, bump the "Last compared" line, and file one issue per gap.

Tip: do not rely on an LLM summary of the spec for the final table; use the `jq` output.