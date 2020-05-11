const {Command, flags} = require('@oclif/command')
const fetch = require('node-fetch');

class GetAPICommand extends Command {

  static args = [
    {name: 'identifier'},
  ]

  static flags = {
    // can pass either --force or -f
    json: flags.boolean({char: 'j'})
  }

  async run() {
    const {args, flags} = this.parse(GetAPICommand)
    const identifier = args.identifier
    let headers = {'Accept': 'application/yaml'}
    if(flags.json) headers={'Accept': 'application/json'}

    fetch(`https://dev-api.swaggerhub.com/apis/${identifier}`, {
      headers: headers
    })
      .then(res => res.text())
      .then(text => console.log(text));
  }
}

GetAPICommand.description = `Fetches an API version`

module.exports = GetAPICommand
