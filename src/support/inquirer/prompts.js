import { confirm, input } from '@inquirer/prompts'

// Only plain text questions are supported: just `name`, `message` and `default` are forwarded to `input`.
// Other question types (e.g. `password`) need their own prompt function, so fail instead of ignoring them.
const ask = async questions => {
  const answers = {}
  for (const { type = 'input', name, message, default: defaultValue } of questions) {
    if (type !== 'input') {
      throw new Error(`Unsupported prompt type '${type}' for question '${name}'`)
    }
    answers[name] = await input({ message, default: defaultValue })
  }
  return answers
}

// A mutable default export keeps these functions stubbable (ES module namespaces are frozen).
const prompts = {
  confirm: message => confirm({ message, default: false }),
  ask
}

export default prompts
