const BaseCommand = require('./base-command')
const { putSpec } = require('../../requests/spec')

class UpdateCommand extends BaseCommand {

  async updatePublish(type, owner, name, version) {
    const pathParams = [owner, name, version, 'settings', 'lifecycle']
    const body = JSON.stringify({ published: true })

    await this.executeHttp({
        execute: () => putSpec(type, pathParams, body), 
        onResolve: this.setSuccessMessage('published')({ 
          type: type === 'apis' ? 'API' : 'domain',
          path: `${owner}/${name}/${version}`
        }),
        options: { resolveStatus: [403] }
    })
  }

  async updateDefault(type, owner, name, version) {
    const pathParams = [owner, name, 'settings', 'default']
    const body = JSON.stringify({ version })
    
    await this.executeHttp({
      execute: () => putSpec(type, pathParams, body), 
      onResolve: this.setSuccessMessage('setDefault')({
        owner,
        name,
        version
      }),
      options: { resolveStatus: [403] }
    })
  }

  async updateVisibility(type, owner, name, version, isPrivate) {
    const visibility = isPrivate ? 'private' : 'public'
    const pathParams = [owner, name, version, 'settings', 'private']
    const body = JSON.stringify({ private: isPrivate })

    await this.executeHttp({
      execute: () => putSpec(type, pathParams, body),
      onResolve: this.setSuccessMessage('visibilityUpdate')({
        owner,
        name,
        version: version,
        visibility
      }),
      options: { resolveStatus: [403] }
    })
  }
}

module.exports = UpdateCommand
