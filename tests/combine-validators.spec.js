var assert = require('chai').assert;
var validator = require('..');
var combineValidators = require('../lib/combine-validators');

describe('combine-validators', function () {
  var v;
  before(function () {
    var a = validator();
    var b = validator().match(5);
    var c = validator().match(Array.isArray).match({length: 2});
    v = combineValidators(a, b, c);
  });

  it('must succeed', function () {
    assert.deepEqual(v(1, 5, [3, 4]).value(), [1, 2, 3]);
  });

  it('must fail if too short', function () {
    assert.isNull(v(1, 5));
  });

  it('must not fail if too long', function () {
    assert.deepEqual(v(1, 5, [3, 4], 33).value(), [1, 2, 3]);
  });

  it('must fail if one fails', function () {
    assert.isNull(v(1, 3, [3, 4]));
  });
});
