const Help = require('@oclif/plugin-help').default

module.exports = class CustomHelp extends Help {

  showTopicHelp(topic) {
    const name = topic.name

    const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name.concat(':')))
    const commands = this.sortedCommands.filter(c => c.id.startsWith(name.concat(':')))

    console.log(this.formatTopic(topic))

    if (subTopics.length > 0) {
      console.log(this.formatTopics(subTopics))
      console.log('')
    }

    if (commands.length > 0) {
      console.log(this.formatCommands(commands))
      console.log('')
    }
  }

  constructor(config, opts) {
    super(config, opts)
    this.opts.all = true
  }
}