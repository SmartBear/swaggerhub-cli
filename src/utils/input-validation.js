const identifierRegex = new RegExp(/^.+\/.+\/.+$/)
function validateObjectIdentifier(id) {
    return identifierRegex.test(id)
}

module.exports = {
    validateObjectIdentifier
}
