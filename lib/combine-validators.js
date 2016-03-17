var ValidationResult = require('../lib/validation-result');

module.exports = function combineValidators() {
  var validators = Array.prototype.slice.call(arguments);
  return function getScore() {
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
};
