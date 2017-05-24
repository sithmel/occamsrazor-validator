module.exports = function isPrototypeOf (proto) {
  return function (obj) { return proto.isPrototypeOf(obj); };
};
