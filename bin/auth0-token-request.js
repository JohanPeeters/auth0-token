const program = require('commander')
const tokenRequest = require('../TokenRequest')

program
  .command('_request_admin_token')
  .description('do not use - added temporarily for testing only')
  .action(function() {
    tokenRequest().then(function(result) {
      console.log(result)
    }, function(err){
      console.log(err)
    })
  })

program.parse(process.argv)
