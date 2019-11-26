var assert = require('chai').assert
var validator = require('..')
var combineValidators = require('../lib/combine-validators')

describe('combine-validators', function () {
  var v
  before(function () {
    var a = validator()
    var b = validator().match(5)
    var c = validator().match(Array.isArray).match({ length: 2 })
    v = combineValidators([a, b, c])
  })

  it('must succeed', function () {
    assert.deepEqual(v([1, 5, [3, 4]]).value(), [0, 1, 2])
  })

  it('must log everything', function () {
    var out = []
    v([1, 5, [3]], function (o) {
      out.push(o)
    })
    assert.deepEqual(out, [
      {
        path: 'length',
        name: 'isNumber:2',
        value: 1,
        validatorName: 'and(isArray object:{length:isNumber:2}) (score: 2)'
      }
    ])
  })

  it('must fail if too short', function () {
    assert.isNull(v([1, 5]))
  })

  it('must not fail if too long', function () {
    assert.deepEqual(v([1, 5, [3, 4], 33]).value(), [0, 1, 2])
  })

  it('must fail if one fails', function () {
    assert.isNull(v([1, 3, [3, 4]]))
  })

  it('must return names', function () {
    assert.equal(v.name, 'isAnything (score: 0), isNumber:5 (score: 1), and(isArray object:{length:isNumber:2}) (score: 2)')
  })
})
