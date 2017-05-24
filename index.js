var combineValidators = require('./lib/combine-validators');
var ValidationResult = require('./lib/validation-result');
var match = require('occamsrazor-match');

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

  v.match = function (func) {
    return _validator(baseScore, funcs.concat(match(func)));
  };

  v.score = function () {
    return funcs.length + baseScore;
  };

  v.important = function (bump) {
    bump = bump || 64;
    return _validator(baseScore + bump, funcs);
  };

  v.functions = function () {
    return funcs;
  };

  v.functionNames = function () {
    return funcs.map(function (func) { return func.name; });
  };

  return v;
};

// returns a validator (function that returns a score)
var validator = function () {
  return _validator(0);
};

// validator.shortcut_validators = shortcut_validators;
validator.combine = combineValidators;

module.exports = validator;
