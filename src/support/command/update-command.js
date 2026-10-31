import BaseCommand from './base-command.js'
import { putSpec } from '../../requests/spec.js'
import { handleErrors } from './handle-response.js'
import inquirer from 'inquirer'

class UpdateCommand extends BaseCommand {

  async updatePublish(type, owner, name, version, isPublished, flags = { force: false }) {
    const pathParams = [owner, name, version, 'settings', 'lifecycle']
    const body = JSON.stringify({ published: isPublished })
    const successMessage = isPublished ? 'published' : 'unpublished'
    const typeLabel = type === 'apis' ? 'API' : 'domain'

    await this.executeHttp({
      execute: () => flags.force ? putSpec(type, pathParams, body, flags) : putSpec(type, pathParams, body),
      onResolve: this.setSuccessMessage(successMessage)({
        type: typeLabel,
        path: `${owner}/${name}/${version}`
      }),
      onReject: async err => {
        if (err.status === 424) {
          if (await this.confirmPublish() === true) {
            await this.executeHttp({
              execute: () => putSpec(type, pathParams, body, { 'force': 'true' }),
              onResolve: this.setSuccessMessage(successMessage)({
                type: typeLabel,
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

  async confirmPublish() {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: `A conflict was detected with other resources referencing or referenced by this definition. 
        Forcing the change may affect them. 
        Do you wish to continue?`,
        default: false
      }
    ])
    return confirm.answer
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

export default UpdateCommand
