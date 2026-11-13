import { confirm, input } from '@inquirer/prompts'

const ask = async questions => {
  const answers = {}
  for (const { name, message, default: defaultValue } of questions) {
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
