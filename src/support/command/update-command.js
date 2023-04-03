const BaseCommand = require('./base-command')
const { putSpec } = require('../../requests/spec')
const { handleErrors } = require('./handle-response')

class UpdateCommand extends BaseCommand {

  async updatePublish(type, owner, name, version, isPublished, flags = { force: false }) {
    const pathParams = [owner, name, version, 'settings', 'lifecycle']
    const body = JSON.stringify({ published: isPublished })
    const successMessage = isPublished ? 'published' : 'unpublished'

    await this.executeHttp({
      execute: () => flags.force ? putSpec(type, pathParams, body, flags) : putSpec(type, pathParams, body),
      onResolve: this.setSuccessMessage(successMessage)({
        type: type === 'apis' ? 'API' : 'domain',
        path: `${owner}/${name}/${version}`
      }),
      onReject: async err => {
        if (err.status === 424 && type === 'apis') {
          if (await this.confirmPublish() === true) {
            this.executeHttp({
              execute: () => putSpec(type, pathParams, body, { 'force': 'true' }),
              onResolve: this.setSuccessMessage(successMessage)({
                type: 'API',
                path: `${owner}/${name}/${version}`
              }),
              options: { resolveStatus: [403] }
            })
          }
        } else {
          handleErrors(err)
        }
      },
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
