var assert = require('chai').assert
var validator = require('..')

describe('validator main', function () {
  var is_hello

  before(function () {
    is_hello = validator().match('hello')
  })

  it('must be a function', function () {
    assert.equal(typeof is_hello, 'function')
  })

  it('must store function names', function () {
    assert.deepEqual(validator().name, 'isAnything (score: 0)')
    assert.deepEqual(is_hello.name, 'isString:hello (score: 1)')
  })

  it('must log', function () {
    var out = []
    is_hello('hi', function (o) {
      out.push(o)
    })
    assert.deepEqual(out, [
      {
        name: 'isString:hello',
        path: '',
        value: 'hi'
      }
    ])
  })

  it('must be clear that is a validator', function () {
    assert(typeof is_hello === 'function' && 'score' in is_hello)
  })
})
