const program = require('commander')
const TokenRequest = require('../TokenRequest')

program
  .command('_request_admin_token')
  .description('do not use - added temporarily for testing only')

program.parse(process.argv)
