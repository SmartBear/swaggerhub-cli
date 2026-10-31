import { Help } from '@oclif/core'

export default class CustomHelp extends Help {

  constructor(config, opts) {
    super(config, opts)
    this.opts.all = true
  }
}