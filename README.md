## Objective ##

Provide a Node.js library to use tokens from Auth0.

## Installation ##

Install as an NPM package, e.g. with

    yarn add auth0-token

## Use ##

Request a token as follows:

    const TokenRequest = require('auth0-token/TokenRequest')

    const config = {
      IdP: 'some-domain.auth0.com',
      clientID: '123',
      secret: 'secret',
      audience: 'audience-string'
    }
    return TokenRequest.clientCredentialsGrant(config)
      .then(function(access_token) {
        ...

For now, only the Client Credentials Grant is supported.

The package also offers a CLI, which, provided `node_modules\.bin` is in the path, may be used as follows:

  ```$ auth0-token request-access-token some-domain.auth0.com 123 secret audience_string```

More extensive help with

  ```$ auth0-token --help```
