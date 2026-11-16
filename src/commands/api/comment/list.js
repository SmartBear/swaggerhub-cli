import { Args, Flags, ux } from '@oclif/core'
import { getApiIdentifierArg } from '../../../support/command/parse-input.js'
import { hasJsonStructure, prettyPrintJSON } from '../../../utils/general.js'
import { getApi } from '../../../requests/api.js'
import { getResponseContent } from '../../../support/command/handle-response.js'
import BaseCommand from '../../../support/command/base-command.js'

const toRow = comment => ({
  id: comment.id,
  user: comment.user?.id ?? '',
  status: comment.status ?? '',
  line: comment.range?.startLine ?? '',
  replies: (comment.replies ?? []).length,
  created: comment.created,
  body: comment.body.replaceAll(/\s+/g, ' ')
})

class ListApiCommentsCommand extends BaseCommand {
  constructor(...props) {
    super(...props)
    this.logComments = this.logComments.bind(this)
  }

  async logComments(response) {
    const content = await getResponseContent(response)

    if (this.jsonOutput || !hasJsonStructure(content)) {
      this.log(hasJsonStructure(content) ? prettyPrintJSON(content) : content)
      return
    }

    const comments = JSON.parse(content)
    if (comments.length === 0) {
      this.log('No comments found.')
      return
    }

    ux.table(comments.map(toRow), {
      id: {},
      user: {},
      status: {},
      line: {},
      replies: {},
      created: {},
      body: {}
    }, {
      printLine: this.log.bind(this)
    })
  }

  async run() {
    const { args, flags } = await this.parse(ListApiCommentsCommand)
    const apiPath = getApiIdentifierArg(args)
    this.jsonOutput = flags.json

    await this.executeHttp({
      execute: () => getApi([apiPath, 'comments']),
      onResolve: this.logComments,
      options: {}
    })
  }
}

ListApiCommentsCommand.description = 'list the comments of an API version'

ListApiCommentsCommand.examples = [
  'swaggerhub api:comment:list organization/api/1.0.0',
  'swaggerhub api:comment:list organization/api/1.0.0 --json'
]

ListApiCommentsCommand.args = {
  'OWNER/API_NAME/VERSION': Args.string({
    required: true,
    description: 'API version to list comments for'
  })
}

ListApiCommentsCommand.flags = {
  json: Flags.boolean({
    char: 'j',
    description: 'prints the comments, including replies and ranges, as JSON'
  }),
  ...BaseCommand.flags
}

export default ListApiCommentsCommand
