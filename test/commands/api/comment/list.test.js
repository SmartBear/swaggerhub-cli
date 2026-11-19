import { expect, test } from '@oclif/test'
import config from '../../../../src/config/index.js'
const shubUrl = 'https://api.swaggerhub.com'
const comments = [{
  id: 'c1',
  user: { id: 'alex', active: true },
  created: '2026-01-01T10:00:00Z',
  body: 'Looks good',
  status: 'OPEN',
  range: { startLine: 7, endLine: 7, startColumn: 1, endColumn: 5, startOffset: 0, endOffset: 4 },
  replies: [{ id: 'r1', user: { id: 'sam', active: true }, created: '2026-01-02T10:00:00Z', body: 'Thanks' }]
}]

describe('valid api:comment:list', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .get('/apis/org/name/1.0.0/comments')
          .reply(200, comments)
      )
      .stdout()
      .command(['api:comment:list', 'org/name/1.0.0'])
      .it('prints a table of comments', ctx => {
        expect(ctx.stdout).to.contain('c1')
        expect(ctx.stdout).to.contain('alex')
        expect(ctx.stdout).to.contain('Looks good')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .get('/apis/org/name/1.0.0/comments')
          .reply(200, comments)
      )
      .stdout()
      .command(['api:comment:list', 'org/name/1.0.0', '--json'])
      .it('prints comments as JSON with --json', ctx => {
        expect(JSON.parse(ctx.stdout)).to.deep.equal(comments)
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .get('/apis/org/name/1.0.0/comments')
          .reply(200, [])
      )
      .stdout()
      .command(['api:comment:list', 'org/name/1.0.0'])
      .it('reports when there are no comments', ctx => {
        expect(ctx.stdout).to.contain('No comments found.')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .get('/apis/org/name/1.0.0/comments')
          .reply(204)
      )
      .stdout()
      .command(['api:comment:list', 'org/name/1.0.0'])
      .it('reports no comments when the server answers 204 with an empty body', ctx => {
        expect(ctx.stdout).to.contain('No comments found.')
      })

  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .get('/apis/org/name/1.0.0/comments')
          .reply(204)
      )
      .stdout()
      .command(['api:comment:list', 'org/name/1.0.0', '--json'])
      .it('prints an empty JSON list with --json when the server answers 204', ctx => {
        expect(JSON.parse(ctx.stdout)).to.deep.equal([])
      })
})

describe('failing api:comment:list', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .get('/apis/org/name/1.0.0/comments')
          .reply(404, { code: 404, message: 'Not found' })
      )
      .stdout()
      .command(['api:comment:list', 'org/name/1.0.0'])
      .exit(2)
      .it('handles 404 from api:comment:list')
})

describe('invalid api:comment:list command', () => {
  test
      .command(['api:comment:list'])
      .catch(err => {
        expect(err.message).to.contain('Missing 1 required arg')
      })
      .it('requires an identifier')

  test
      .command(['api:comment:list', 'org/name'])
      .catch(err => {
        expect(err.message).to.contain('Argument must match OWNER/API_NAME/VERSION format')
      })
      .it('requires a version')
})
