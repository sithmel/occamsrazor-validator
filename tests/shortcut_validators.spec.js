var assert = require('chai').assert;
var validator = require('..');

describe('shortcut validators', function () {

  before(function () {
    validator.shortcut_validators.is5 = function () {
      return function (n) {
        return n === 5;
      };
    };
  });

  it('must validate custom validator', function () {
    var is5 = validator().is5()
    assert.equal(is5(5).value(), 2);
    assert.isNull(is5(6));
  });
});

describe('isPrototype/isInstanceOf', function () {
  var Square, square;

  before(function () {
    Square = function (l) {
      this.l = l;
    }
    square = new Square(4);
  });

  it('must validate using isPrototypeOf', function () {
    var isSquareProto = validator().isPrototypeOf(Square.prototype)
    assert.equal(isSquareProto(square).value(), 2);
  });

  it('must validate using isInstanceOf', function () {
    var isSquareInstance = validator().isInstanceOf(Square)
    assert.equal(isSquareInstance(square).value(), 2);
  });
});

describe('has', function () {
  var isAnything, hasWidthAndHeight;

  before(function () {
    isAnything = validator();
    hasWidthAndHeight = isAnything.has('width', 'height');
  });

  it('must set score correctly', function () {
    assert.equal(hasWidthAndHeight.score(), 2);
  });

  it('must match', function () {
    assert.equal(hasWidthAndHeight({width: 8, height: 10}).value(), 2);
  });

  it('must not match', function () {
    assert.isNull(hasWidthAndHeight({width: 12}));
  });
});
