const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const tokenRequest = require('../TokenRequest').clientCredentialsGrant
const https = require('https')
const sinon = require('sinon')
const EventEmitter = require('events')
const stream = require('stream')

describe('TokenRequest', function() {

  describe('clientCredentialsGrant', function() {
    let stubResponse
    const config = {
      IdP: 'idP',
      clientID: 'ClientID',
      secret: 'ClientSecret',
      audience: 'audience'
    }

    beforeEach(function(){
      stubResponse = new EventEmitter()
      stubResponse.setEncoding = (encoding) => {}
      stubResponse.statusCode = 200
      sinon
        .stub(https, 'request')
        .returns(new stream.Writable({
          write(chunk, encoding, callback) {}
        }))
        .yields(stubResponse)
      })

    afterEach(function(){
      https.request.restore()
    })

    it('returns a Promise', function(){
      let request = clientCredentialsGrant(config)
      expect(request).to.be.an.instanceOf(Promise)
    })

    it('returns the access token', function(){
      let request = clientCredentialsGrant(config)
      setTimeout(() => {
        assert(stubResponse.emit('data', JSON.stringify({access_token: 'bar'})))
      })
      setTimeout(() => {
        assert(stubResponse.emit('end'))
      })
      return request
        .then(function(result) {
          expect(result).to.be.equal('bar')
        })
    })

    it('rejects if the argument does not include the IdP', function() {
      const arg = {
        clientID: 'ClientID',
        secret: 'ClientSecret'
      }
      let request = clientCredentialsGrant(arg)
      return request
        .then(function(result) {
          assert.fail(result)
        }, function(error) {
        })
    })

    it('rejects if the argument does not include the clientID', function() {
      const arg = {
        IdP: 'IdP',
        secret: 'ClientSecret'
      }
      let request = clientCredentialsGrant(arg)
      return request
        .then(function(result) {
          assert.fail(result)
        }, function(error) {
        })
    })

    it('rejects if the argument does not include the secret', function() {
      const arg = {
        IdP: 'IdP',
          clientID: 'ClientID',
      }
      let request = clientCredentialsGrant(arg)
      return request
        .then(function(result) {
          assert.fail(result)
        }, function(error) {
        })
    })

    it('rejects if statusCode is not 200', function(){
      stubResponse.statusCode = 407
      let request = clientCredentialsGrant(config)
      stubResponse.emit('data', JSON.stringify({access_token: 'bar'}))
      stubResponse.emit('end')
      return request
        .then(function(result) {
          assert.fail(result)
        }, function(error) {
        })
    })

    it('rejects if no data is returned', function(){
      let request = clientCredentialsGrant(config)
      stubResponse.emit('end')
      return request
        .then(function(result) {
          assert.fail(result)
        }, function(error) {
        })
    })

    it('rejects if no access token is returned', function(){
      let request = clientCredentialsGrant(config)
      stubResponse.emit('data', JSON.stringify({foo: 'bar'}))
      stubResponse.emit('end')
      return request
        .then(function(result) {
          assert.fail(result)
        }, function(error) {
        })
    })

  })
})
