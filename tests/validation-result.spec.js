var assert = require('chai').assert;
var validator = require('..');
var ValidationResult = require('../lib/validation-result');

describe('validation-result scalar', function () {
  var items;
  beforeEach(function () {
    items = [];
    items.push(new ValidationResult(9));
    items.push(new ValidationResult(10));
    items.push(new ValidationResult(6));
    items.push(new ValidationResult(2));
  });

  it('must return correct key', function () {
    assert.equal(items[0].toString(), 'I');
    assert.equal(items[1].toString(), 'J');
    assert.equal(items[2].toString(), 'F');
    assert.equal(items[3].toString(), 'B');
  });

  it('must return correct value', function () {
    assert.equal(items[0].value(), 9);
    assert.equal(items[1].value(), 10);
    assert.equal(items[2].value(), 6);
    assert.equal(items[3].value(), 2);
  });

  it('must compare correctly', function () {
    assert(items[0] < items[1]);
    assert(items[1] > items[2]);
    assert(items[2] > items[3]);
  });

  it('must sort correctly', function () {
    items.sort();
    var a = items.map(function (v) {return v.toString();});
    assert.deepEqual(a, ['B', 'F', 'I', 'J'])
  });
});

describe('validation-result array', function () {
  var items;
  beforeEach(function () {
    items = [];
    items.push(new ValidationResult([9, 2]));
    items.push(new ValidationResult([9, 3]));
    items.push(new ValidationResult(8));
    items.push(new ValidationResult([2, 3, 4]));
  });

  it('must return correct key', function () {
    assert.equal(items[0].toString(), 'IB');
    assert.equal(items[1].toString(), 'IC');
    assert.equal(items[2].toString(), 'H');
    assert.equal(items[3].toString(), 'BCD');
  });

  it('must return correct value', function () {
    assert.deepEqual(items[0].value(), [9, 2]);
    assert.deepEqual(items[1].value(), [9, 3]);
    assert.deepEqual(items[2].value(), 8);
    assert.deepEqual(items[3].value(), [2, 3, 4]);
  });

  it('must compare correctly', function () {
    assert(items[0] < items[1]);
    assert(items[1] > items[2]);
    assert(items[2] > items[3]);
  });

  it('must sort correctly', function () {
    items.sort();
    var a = items.map(function (v) {return v.toString();});
    assert.deepEqual(a, ['BCD', 'H', 'IB', 'IC'])
  });
});
