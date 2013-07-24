var test = require('tape')
var fallback = require('../index')

test('fallback tries alternatives in serial', function (t) {
  t.plan(3)

  var iterations = 0

  fallback([1, 16, 43], function (item, cb) {
    iterations++
    cb(null, item % 2 === 0) // succeed on even items
  }, function (err, result, item) {
    t.equal(result, true)
    t.equal(item, 16)
    t.equal(iterations, 2)
    t.end()
  })
})

test('if an error is returned the sequence is interrupted', function (t) {
  t.plan(2)

  var iterations = 0

  fallback([1, 2, 3], function (item, cb) {
    iterations++
    cb(new Error())
  }, function (err) {
    t.ok(err)
    t.equal(iterations, 1)
    t.end()
  })
})

test('the fallback sequence ends on the first successful item', function (t) {
  t.plan(2)

  var iterations = 0
  var tried = []

  fallback(['apples', 'androids', 'persimmons', 'albania'], function (item, cb) {
    iterations++
    tried.push(item)
    if (item[0] !== 'a') {
      return cb(null, item)
    }
    cb()
  }, function (err) {
    t.equal(iterations, 3)
    t.equal(tried.indexOf('albania'), -1)
    t.end()
  })
})

test('if no items in the fallback sequence succeed it returns false', function (t) {
  t.plan(2)

  var iterations = 0
  var tried = []

  fallback([1,3,4,5], function (item, cb) {
    iterations++
    if (item == 2) {
      return cb(null, item)
    }
    cb()
  }, function (err, result) {
    t.equal(iterations, 4)
    t.equal(result, false)
    t.end()
  })
})