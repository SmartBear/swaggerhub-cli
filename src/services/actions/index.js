const request = require('request')

const postApi = (obj) => {
  const [ owner, name ] = obj.pathParams
  request.post(`https://dev-api.swaggerhub.com/apis/${owner}/${name}`, {
    headers:obj.headers,
    qs:obj.queryParams,
    body:obj.body
  }, (error) => {
    if (error) {
      console.error(`Error creating API`)
      process.exit(1)
    }
    console.log(`Created API ${owner}/${name}`)
  })
}

module.exports = {
  postApi
}