module.exports = function fallback(array, iteratorFunction, outerCallback) {

  forEachSerial(array, function (arrayItem, next) {
    try {
      iteratorFunction(arrayItem, function (err, result) {
        if (err) {
          err.arrayItem = arrayItem
          return outerCallback(err)
        }

        else if (result === false || result === void 0) {
          return next()
        }
        // arrayItem was successful
        return outerCallback(null, result, arrayItem, array)

      })
    } catch (e) {
      e.arrayItem = arrayItem
      outerCallback(e)
    }
  }, function (err) {
    if (err) return outerCallback(err)

    // no arrayItem was successful
    outerCallback(null, false, null, array)
  })

}

function forEachSerial(array, iterator, callback) {
  if (!array.length) {
    callback()
    return
  }
  var arr = array.slice()
  var next = arr.shift()
  process.nextTick(function () {
    iterator(next, function (err) {
      if (err) return callback(err)
      forEachSerial(arr, iterator, callback)
    })
  })
}
