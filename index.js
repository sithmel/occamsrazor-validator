var match = require('occamsrazor-match');
var and = require('occamsrazor-match/extra/and');
var combineValidators = require('./lib/combine-validators');
var ValidationResult = require('./lib/validation-result');
var setName = require('./lib/setName');

function buildValidator(baseScore, funcs) {
  baseScore = baseScore || 0;
  funcs = funcs || [];
  var innerValidator = and(funcs);

  function validator(obj, callback) {
    if (innerValidator(obj, callback)) {
      return new ValidationResult(funcs.length + baseScore, obj);
    }
    return null;
  };

  validator.score = function () {
    return funcs.length + baseScore;
  };

  validator.match = function (func) {
    return buildValidator(baseScore, funcs.concat(match(func)));
  };

  validator.important = function (bump) {
    bump = bump || 64;
    return buildValidator(baseScore + bump, funcs);
  };

  setName(validator, innerValidator.name + ' (score: ' + validator.score() + ')');

  return validator;
}

buildValidator.combine = combineValidators;

module.exports = buildValidator;
