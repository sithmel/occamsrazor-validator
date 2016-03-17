var assert = require('chai').assert;
var validator = require('..');
var arrayToStr = require('../lib/array-to-str');

describe('array-to-str', function () {
  it('must work with small numbers', function () {
    assert.equal(arrayToStr([1, 2, 3]), 'ABC');
  });

  it('must work with big numbers', function () {
    assert.equal(arrayToStr([100, 200, 300]), '¤ĈŬ');
  });
});
