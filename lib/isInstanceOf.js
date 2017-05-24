module.exports = function isInstanceOf(constructor) {
  return function (obj) { return obj instanceof constructor; };
};
