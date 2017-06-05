var ValidationResult = require('./validation-result');
var setName = require('./setName');

module.exports = function combineValidators() {
  var validators = Array.prototype.slice.call(arguments);
  var validatorWrapper = function validatorWrapper() {
    var args = Array.prototype.slice.call(arguments);
    var i, l, current_score, score = [];
    if (args.length < validators.length) {
      return null;
    }
    for (i = 0, l = validators.length; i < l; i++) {
      current_score = validators[i](args[i]);
      if (!current_score) {
        return null;
      }
      score.push(current_score.value());
    }
    return new ValidationResult(score, args);
  };

  setName(validatorWrapper, validators.map(function (v) { return v.name; }).join(', '));

  return validatorWrapper;
};
