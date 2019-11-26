var arrayToStr = require('./array-to-str')

function ValidationResult (score) {
  this.score = score
  this._key = undefined
}

ValidationResult.prototype.toString = function () {
  if (this._key) {
    return this._key
  }
  this._key = arrayToStr(Array.isArray(this.score) ? this.score : [this.score])
  return this._key
}

ValidationResult.prototype.value = function () {
  return this.score
}

module.exports = ValidationResult
