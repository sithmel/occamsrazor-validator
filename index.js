var combineValidators = require('./lib/combine-validators');
var ValidationResult = require('./lib/validation-result');
var match = require('./lib/match');
var has = require('./lib/has');
var isPrototypeOf = require('./lib/isPrototypeOf');
var isInstanceOf = require('./lib/isInstanceOf');

var isAnything = function (obj) {
  return true;
};

var shortcut_validators = {
  match: match,
  has: has,
  isPrototypeOf: isPrototypeOf,
  isInstanceOf: isInstanceOf
};

var _validator = function (baseScore, funcs) {
  var k;
  funcs = funcs || [];
  var v = function validator(obj) {
    var i, score, total = 0;
    for (i = 0; i < funcs.length; i++) {
      score = funcs[i](obj);
      if (!score) {
        return null;
      }
      total += score; // 1 + true === 2
    }
    return new ValidationResult(total + baseScore, obj);
  };

  v.chain = function (func) {
    return _validator(baseScore, funcs.concat(func));
  };

  v.score = function () {
    return funcs.length + baseScore;
  };

  v.important = function (bump) {
    bump = bump || 64;
    return _validator(baseScore + bump, funcs);
  };

  // shortcut validators
  for (k in shortcut_validators) {
    v[k] = (function (f) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        return v.chain(f.apply(null, args));
      };
    }(shortcut_validators[k]));
  }

  return v;
};

// returns a validator (function that returns a score)
var validator = function () {
  return _validator(0);
};

validator.shortcut_validators = shortcut_validators;
validator.combine = combineValidators;

module.exports = validator;
