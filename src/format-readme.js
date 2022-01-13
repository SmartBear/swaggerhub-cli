const fs = require('fs')

const removeArgsFromHeaders = line => {
    const words = line.split(' ')
    if (words.length <= 3) return line
    return `## ${words[1]} ${words[2]}\``
}

const removeArgsFromLinks = line => {
    const slug = line.substr(line.indexOf('#')+1, line.length-2)
    const words = slug.split('-')
    if (words.length <= 2) return line
    return line.replace(slug, `${words[0]}-${words[1]})`)
}

const main = () => {
    const outputBuffer = []
    try {
        const data = fs.readFileSync('../README.md', 'utf8')
        const lineBuffer = data.split('\n')

        lineBuffer.forEach(line => {
            if (line.startsWith('* [`swaggerhub')) return outputBuffer.push(removeArgsFromLinks(line))
            if (line.startsWith('## `swaggerhub')) return outputBuffer.push(removeArgsFromHeaders(line))
            return outputBuffer.push(line)
        })

        const output = outputBuffer.join('\n')
        fs.writeFileSync('README.md', output)

    } catch (err) {
        console.error(err)
    }
}

if (require.main === module) {
    main()
}
