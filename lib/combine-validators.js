var ValidationResult = require('./validation-result');
var setName = require('occamsrazor-match/lib/setName');

function addValidatorName(validatorName, callback) {
  if (!callback) return;
  return function (obj) {
    obj.validatorName = validatorName;
    callback(obj);
  };
}

module.exports = function combineValidators(validators) {
  var validatorName = validators.map(function (v) { return v.name; }).join(', ');
  var validatorWrapper = function validatorWrapper(args, callback) {
    var i, l, current_score, score = [], validator, decoratedCallback;
    decoratedCallback = addValidatorName(validatorName, callback);
    if (args.length < validators.length) {
      decoratedCallback && decoratedCallback({ path: '', name: 'minArguments:' + args.length, value: args });
      return null;
    }
    for (i = 0, l = validators.length; i < l; i++) {
      validator = validators[i];
      decoratedCallback = addValidatorName(validators[i].name, callback);
      current_score = validator(args[i], decoratedCallback);
      if (!current_score) {
        return null;
      }
      score.push(current_score.value());
    }
    return new ValidationResult(score, args);
  };

  validatorWrapper.validators = validators;
  return setName(validatorWrapper, validatorName);
};
