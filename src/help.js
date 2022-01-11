const Help = require('@oclif/plugin-help').Help

module.exports = class CustomHelp extends Help {

  constructor(config, opts) {
    super(config, opts)
    this.opts.all = true
  }
}