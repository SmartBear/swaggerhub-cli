const identifierRegex = new RegExp(/^\w+\/\w+\/\w+$/gm)

function validateObjectIdentifier(id){
    return identifierRegex.test(id)
}

module.exports = {
    validateObjectIdentifier
}
  