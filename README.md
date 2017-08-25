## Goal ##

Provide a Node.js library to request tokens from Auth0. At present, only the OAuth 2.0 Client Credentials Grant is supported.

## Installation ##

Install as an NPM package, e.g. with

    yarn add auth0-token-request

## Use ##

    const TokenRequest = require('auth0-token-request/TokenRequest')

    const config = {
      IdP: 'some-domain.auth0.com',
      clientID: '123',
      secret: 'secret',
      audience: 'audience-string'
    }
    return TokenRequest.clientCredentialsGrant(config)
      .then(function(access_token) {
        ...
