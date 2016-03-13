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
    assert.equal(is5(5), 2);
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
    assert.equal(isSquareProto(square), 2);
  });

  it('must validate using isInstanceOf', function () {
    var isSquareInstance = validator().isInstanceOf(Square)
    assert.equal(isSquareInstance(square), 2);
  });
});
