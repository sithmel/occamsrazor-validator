var assert = require('chai').assert;
var validator = require('..');

describe('validator match', function () {

  it('must match using a string', function () {
    var is_hello = validator().match('hello');
    assert.equal(is_hello('hello'), 2);
    assert.isNull(is_hello('nothello'));
  });

  it('must match using a regexp', function () {
    var is_hello = validator().match(/hello/);
    assert.equal(is_hello('hello world'), 2);
    assert.isNull(is_hello('good morning world'));
  });

  describe('single/multiple match', function () {
    var isAnything, hasWidth, hasHeight_hasWidth;

    before(function () {
      isAnything = validator();
      hasWidth = isAnything.match({'width': undefined});
      hasHeight_hasWidth = isAnything.match({'width': undefined, 'height': undefined});
    });

    it('must set score correctly', function () {
      assert.equal(isAnything.score(), 1);
      assert.equal(hasWidth.score(), 2);
      assert.equal(hasHeight_hasWidth.score(), 2);
    });

    it('must match', function () {
      assert.equal(hasWidth({width: 1, height: 2}), 2);
      assert.equal(hasHeight_hasWidth({width: 1, height: 2}), 2);
    });
  });

  describe('single/multiple match using objects', function () {
    var isAnything, hasWidth10, hasX10;

    before(function () {
      isAnything = validator();
      hasWidth10 = isAnything.match({'width': '10'});
      hasX10 = isAnything.match({
        center: {
          x: "10", y: undefined
        }
      });
    });

    it('must set score correctly', function () {
      assert.equal(hasWidth10.score(), 2);
      assert.equal(hasX10.score(), 2);
    });

    it('must match', function () {
      assert.equal(hasWidth10({width: "10"}), 2);
      assert.equal(hasX10({center: {x:"10", y:"1"}}), 2);
    });

    it('must not match', function () {
      assert.isNull(hasX10({center: {x:"11", y:"1"}}));
      assert.isNull(hasWidth10({width: 1}));
      assert.isNull(hasX10({center: {x:"10"}}));
      assert.isNull(hasX10({center: "1"}));
    });

  });

  describe('single/multiple match using functions', function () {
    var isAnything, hasWidthbetween5and10, isNotANumber, isArray;

    before(function () {
      isAnything = validator();
      hasWidthbetween5and10 = isAnything.match({width: function (w){
        return w >= 5 && w <=10;
      }});
      isNotANumber = isAnything.match(isNaN);
      isArray = isAnything.match(Array.isArray);
    });

    it('must set score correctly', function () {
      assert.equal(hasWidthbetween5and10.score(), 2);
    });

    it('must match', function () {
      assert.equal(hasWidthbetween5and10({width: 8}), 2);

      assert.equal(isNotANumber(NaN), 2);
      assert.equal(isArray([1, 2, 3]), 2);
    });

    it('must not match', function () {
      assert.isNull(hasWidthbetween5and10({width: 12}));
      assert.isNull(hasWidthbetween5and10({width: 4}));
      assert.isNull(isNotANumber(1));
      assert.isNull(isArray(true));
    });
  });

  describe('single/multiple match using arrays', function () {
    var isAnything, hasWidthAndHeight;

    before(function () {
      isAnything = validator();
      hasWidthAndHeight = isAnything.match(['width', 'height']);
    });

    it('must set score correctly', function () {
      assert.equal(hasWidthAndHeight.score(), 2);
    });

    it('must match', function () {
      assert.equal(hasWidthAndHeight({width: 8, height: 10}), 2);
    });

    it('must not match', function () {
      assert.isNull(hasWidthAndHeight({width: 12}));
    });
  });

  describe('single/multiple match using null', function () {
    var isAnything, isNull;

    before(function () {
      isAnything = validator();
      isNull = isAnything.match(null);
    });

    it('must set score correctly', function () {
      assert.equal(isNull.score(), 2);
    });

    it('must match', function () {
      assert.equal(isNull(null), 2);
    });

    it('must not match', function () {
      assert.isNull(isNull(1));
    });
  });

  describe('single/multiple match using boolean', function () {
    var isAnything, isTrue, isFalse;

    before(function () {
      isAnything = validator();
      isTrue = isAnything.match(true);
      isFalse = isAnything.match(false);
    });

    it('must set score correctly', function () {
      assert.equal(isTrue.score(), 2);
      assert.equal(isFalse.score(), 2);
    });

    it('must match', function () {
      assert.equal(isTrue(true), 2);
      assert.equal(isFalse(false), 2);
    });

    it('must not match', function () {
      assert.isNull(isTrue(false));
      assert.isNull(isFalse(true));
      assert.isNull(isFalse(''));
      assert.isNull(isTrue(''));
    });
  });

});
