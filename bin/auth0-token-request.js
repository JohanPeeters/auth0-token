const program = require('commander')
const TokenRequest = require('../TokenRequest')

program
  .command('request_access_token [IdP] [client_id] [client_secret] [audience]')
  .description('do not use - added temporarily for testing only')
  .action(function(idP, clientID, clientSecret, audience) {
    const config = {
      IdP: idP,
      clientID: clientID,
      secret: clientSecret,
      audience: audience,
      verbose: true
    }
    const verbose = config.verbose || false
    if (verbose)
        console.log(`passing config ${JSON.stringify(config)} to TokenRequest.clientCredentialsGrant`)
    TokenRequest.clientCredentialsGrant(config).then(function(result) {
      console.log(result)
    },function(err){
      console.log(err)
    })
  })

program.parse(process.argv)
