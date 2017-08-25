const https = require('https')

const tokenEndpoint = '/oauth/token'

clientCredentialsGrant = function (config) {
  const verbose = config.verbose
  // istanbul ignore next
  if (verbose)
    console.log(`connecting with parameters ${JSON.stringify(config)}`)
  const idP = config.IdP
  const clientID = config.clientID
  const secret = config.secret
  const audience = config.audience
  if (!(idP && clientID && secret)) {
    const err = new TypeError()
    const missingProperties = []
    if (!idP) missingProperties.push('idP')
    if (!clientID) missingProperties.push('clientID')
    if (!secret) missingProperties.push('secret')
    err.message = `clientCredentialsGrant called with ${JSON.stringify(config)}.` +
      `Missing ${JSON.stringify(missingProperties)}`
    return Promise.reject(err)
  }
  return new Promise(function(resolve, reject){
    const options = {
      hostname: idP,
      path: tokenEndpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const postData = JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientID,
      client_secret: secret,
      audience: audience
    })
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        const statusCode = res.statusCode
        if (statusCode == 200 && rawData) {
          let body = JSON.parse(rawData)
          let access_token = body.access_token
          // the response additionally contains following fields
          // * expires_in (86400s or 1d)
          // * scope
          // * token_type (Bearer)
          // Their values are ignored for now
          access_token?resolve(access_token):reject(new Error(`no access token \n${rawData}`))
        } else {
          let err = new Error(`auth token request failed with statusCode ${statusCode}`)
          err.statusCode = statusCode
          err.rawData = rawData
          reject(err)
        }
      })
    })
    // istanbul ignore next
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`)
      reject(e)
    })
    req.write(postData)
    req.end()
  })
}

module.exports = {
  clientCredentialsGrant: clientCredentialsGrant
}
