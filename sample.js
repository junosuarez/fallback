// test a list of servers for a response
var fallback = require('./index')
var request = require('request')

var servers = ['http://foo.baz', 'http://google.com', 'http://fail']

fallback(servers, function (server, callback) {
  console.log('trying server at ' + server)
  request(server, function (err, response) {
    if (err || response.statusCode >= 400) {
      // try the next server
      return callback()
    }
    callback(null, response.statusCode)
  })
}, function (err, result, server) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (result) {
    console.log('server ' + server + ' returned: ' + result)
  } else {
    console.log('no servers returned successfully')
  }
})