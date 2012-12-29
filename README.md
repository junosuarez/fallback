# fallback
retry a function with a series of arguments until one works

## usage
    // run this in the repo: `npm install; node sample.js`
    // test a list of servers for a response
    var fallback = require('fallback')
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

returns

    trying server at http://foo.baz
    trying server at http://google.com
    server http://google.com returned: 200

## API

    fallback: (array: Array, iteratorFunction: IteratorFunction, outerCallback: OuterCallback) => void

Call `fallback` with an array of alternative values to be used as arguments on
`iteratorFunction`.

    IteratorFunction: (arrayItem, callback: (err: Error, result) => void) => void

`iteratorFunction` is an async function of
`function (arrayItem, callback)`, where `callback` is a normal node-style
`callback(err, result)` continuation. **Note** that if an error is given to
`callback`, the entire fallback sequence will terminate early. This should be
used for unrecoverable errors. To indicate that the operation on the current
`arrayItem` did not succeed and that the next one should be tried, `callback`
should be invoked with a `null` error and an `undefined` or `false` value for
`result`. A `result` value of `null` has the semantics that "the operation
succeeded (and therefore further fallbacks should not be tried), and there
was no result value".

  OuterCallback: (err: Error, result, arrayItem, array: Array) => void

In `outerCallback`, there are three possible return states:
`err` is not undefined: there was an unrecoverable error when executing the
fallback sequence.
`result` is `false`: none of the fallback alternatives were successful.
`arrayItem` is null, and `array` contains the original array.
`result` is not `false`: one of the fallback alternatives was successful.
`result` contains the `result` value of that operation and `arrayItem`
contains the value that was used in the successful operation. `array`
contains the original array.

The parameters for `outerCallback` are similar to those in the callback for
`Array.prototype.map` - first the value, then an index, then the original
collection.

## isn't this the same as `async.some`?

Sort of, but `fallback` has much better semantics, and it uses normal
node-style async callbacks (eg, `callback(err, result)` ) for composability.

## installation
with npm

    $ npm install fallback

## license
MIT
(c) 2012 jden - Jason Denizac <jason@denizac.org
http://jden.mit-license.org/2012