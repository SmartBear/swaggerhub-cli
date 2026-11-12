import { expect } from '@oclif/test'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../src/format-readme.js', import.meta.url))

describe('format-readme', () => {
  let workDir

  beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'format-readme-'))
  })

  afterEach(() => {
    fs.rmSync(workDir, { recursive: true, force: true })
  })

  const formatReadme = content => {
    fs.writeFileSync(path.join(workDir, 'README.md'), content)
    execFileSync(process.execPath, [script], { cwd: workDir })
    return fs.readFileSync(path.join(workDir, 'README.md'), 'utf8')
  }

  it('strips arguments from command headers', () => {
    expect(formatReadme('## `swaggerhub api:get OWNER/API_NAME[/VERSION]`'))
      .to.equal('## `swaggerhub api:get`')
  })

  it('keeps headers that have no arguments', () => {
    expect(formatReadme('## `swaggerhub api:get`')).to.equal('## `swaggerhub api:get`')
  })

  it('strips arguments from table of contents links', () => {
    expect(formatReadme('* [`swaggerhub api:get OWNER/API_NAME`](#swaggerhub-apiget-ownerapi_name)'))
      .to.equal('* [`swaggerhub api:get OWNER/API_NAME`](#swaggerhub-apiget)')
  })

  it('keeps links that have no arguments', () => {
    const line = '* [`swaggerhub api:get`](#swaggerhub-apiget)'
    expect(formatReadme(line)).to.equal(line)
  })

  it('leaves other lines untouched', () => {
    const text = '# swaggerhub-cli\n\nSome text\n'
    expect(formatReadme(text)).to.equal(text)
  })

  it('logs the error when README.md cannot be read', () => {
    const result = spawnSync(process.execPath, [script], { cwd: workDir, encoding: 'utf8' })
    expect(result.status).to.equal(0)
    expect(result.stderr).to.contain('ENOENT')
  })

  it('does not run when imported as a module', async () => {
    await import(`${new URL('../src/format-readme.js', import.meta.url).href}?imported`)
    expect(fs.existsSync(path.join(workDir, 'README.md'))).to.equal(false)
  })
})
