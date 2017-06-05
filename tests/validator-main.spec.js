var assert = require('chai').assert;
var validator = require('..');

describe('validator main', function () {
  var is_hello;

  before(function () {
    is_hello = validator().match('hello');
  });

  it('must be a function', function () {
    assert.equal(typeof is_hello, 'function');
  });

  it('must store function names', function () {
    assert.deepEqual(validator().name, 'isAnything');
    assert.deepEqual(is_hello.name, 'isString:hello');
  });

  it('must be clear that is a validator', function () {
    assert(typeof is_hello === 'function' && 'score' in is_hello);
  });
});
