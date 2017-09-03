#!/usr/bin/env node

const program = require('commander')
const TokenRequest = require('../TokenRequest')

program
  .command('request-access-token [IdP] [client_id] [client_secret] [audience]')
  .description('request an access token. ' +
    '[IdP] is the STS\' domain name. ' +
    '[client_id] is the ID with which the requesting client is registered at the IdP. ' +
    '[client_secret] is it\'s secret. ' +
    '[audience] is the resource server to which the client is trying to gain access.')
  .action(function(idP, clientID, clientSecret, audience) {
    const config = {
      IdP: idP,
      clientID: clientID,
      secret: clientSecret,
      audience: audience
    }
    TokenRequest.clientCredentialsGrant(config).then(function(result) {
      console.log(result)
    },function(err){
      console.log(err)
    })
  })

program.parse(process.argv)
