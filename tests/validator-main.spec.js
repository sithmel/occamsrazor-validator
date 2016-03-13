var assert = require('chai').assert;
var validator = require('..');

describe('validator main', function () {
  var is_hello;

  before(function () {
    is_hello = validator().match('hello');
  });

  it('must be a function', function () {
    assert.equal(typeof is_hello, "function");
  });

  it('must have the right name', function () {
    assert.equal(is_hello.name, "validator");
  });
});
