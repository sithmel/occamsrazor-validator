var assert = require('chai').assert;
var validator = require('..');

describe('validator score', function () {
  var is_anything, is_instrument, is_guitar, is_electricguitar;
  var instrument, drum, guitar, electricguitar;

  before(function () {

    is_anything = validator();

    is_instrument = validator().chain(function (obj){
      return 'instrument_name' in obj;
    });

    is_guitar = is_instrument.chain( function (obj){
      return 'nStrings' in obj;
    });

    is_electricguitar = is_guitar.chain(function (obj){
      return 'ampli' in obj;
    });

    instrument = {instrument_name : 'instrument'};

    drum = {
      instrument_name : 'instrument',
      crash : 'tin tin'
    };

    guitar = {
      instrument_name : 'guitar',
      nStrings : 6
    };

    electricguitar = {
      instrument_name : 'electric guitar',
      nStrings : 6,
      ampli : 'marshall'
    };
  });

  it('must return right score', function () {
    assert.equal(is_anything.score(), 1);
    assert.equal(is_instrument.score(), 2);
    assert.equal(is_guitar.score(), 3);
    assert.equal(is_electricguitar.score(), 4);
  });

  it('must pass generic validation', function () {
    assert.equal(is_anything(instrument), 1);
    assert.equal(is_anything(drum), 1);
    assert.equal(is_anything(guitar), 1);
    assert.equal(is_anything(electricguitar), 1);
  });

  it('must sometimes pass validation (1 check)', function () {
    assert.equal(is_instrument(instrument), 2);
    assert.equal(is_instrument(drum), 2);
    assert.equal(is_instrument(guitar), 2);
    assert.equal(is_instrument(electricguitar), 2);
  });

  it('must sometimes pass validation (2 checks)', function () {
    assert.isNull(is_guitar(instrument));
    assert.isNull(is_guitar(drum));
    assert.equal(is_guitar(guitar), 3);
    assert.equal(is_guitar(electricguitar), 3);
  });

  it('must sometimes pass validation (3 checks)', function () {
    assert.isNull(is_electricguitar(instrument));
    assert.isNull(is_electricguitar(drum));
    assert.isNull(is_electricguitar(guitar));
    assert.equal(is_electricguitar(electricguitar), 4);
  });

  describe('important', function () {
    var is_guitar_important;

    before(function () {
      is_guitar_important = is_guitar.important();
    });

    it('must be raised by important', function () {
      assert.equal(is_guitar_important.score(), 67);
    });

    it('must not match using important', function () {
      assert.equal(is_guitar_important(guitar), 67);
    });

    it('must match using important', function () {
      assert.isNull(is_guitar_important(drum));
    });
  });

});
