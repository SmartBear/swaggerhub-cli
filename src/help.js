const { Help } = require('@oclif/core')

module.exports = class CustomHelp extends Help {

  constructor(config, opts) {
    super(config, opts)
    this.opts.all = true
  }
}