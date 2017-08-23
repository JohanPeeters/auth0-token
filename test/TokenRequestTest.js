const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const tokenRequest = require('../TokenRequest').clientCredentialsGrant
const https = require('https')
const sinon = require('sinon')
const EventEmitter = require('events')
const stream = require('stream')

describe('tokenRequest', function() {

  let stubResponse

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
    let request = clientCredentialsGrant('123', '123', 'audience')
    expect(request).to.be.an.instanceOf(Promise)
  })

  it('returns the access token', function(){
    let request = clientCredentialsGrant('123', '123', 'audience')
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

  it('rejects if statusCode is not 200', function(){
    stubResponse.statusCode = 407
    let request = clientCredentialsGrant('123', '123', 'audience')
    stubResponse.emit('data', JSON.stringify({access_token: 'bar'}))
    stubResponse.emit('end')
    return request
      .then(function(result) {
        assert.fail(result)
      }, function(error) {
      })
  })

  it('rejects if no data is returned', function(){
    let request = clientCredentialsGrant('123', '123', 'audience')
    stubResponse.emit('end')
    return request
      .then(function(result) {
        assert.fail(result)
      }, function(error) {
      })
  })

  it('rejects if no access token is returned', function(){
    let request = clientCredentialsGrant('123', '123', 'audience')
    stubResponse.emit('data', JSON.stringify({foo: 'bar'}))
    stubResponse.emit('end')
    return request
      .then(function(result) {
        assert.fail(result)
      }, function(error) {
      })
  })

})
