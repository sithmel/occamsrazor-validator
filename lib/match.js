function setName(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
}

function isAnything() {
  return true;
}

function isNull(s) {
  return s === null;
}

function isNumber(o) {
  var func = function (s) { return s === o; };
  setName(func, 'isNumber:' + o);
  return func;
}

function isString(o) {
  var func = function (s) { return s === o; };
  setName(func, 'isString:' + o);
  return func;
}

function isBoolean(o) {
  var func = function (s) { return s === o; };
  setName(func, o ? 'isTrue' : 'isFalse');
  return func;
}

function isRegExp(o) {
  var func = function (s) {
    return o.test(s);
  };
  setName(func, 'isRegExp:' + o.toString());
  return func;
}

function isArray(o) {
  var func = function (arr) {
    if (!Array.isArray(arr)) return false;
    for (var i = 0; i < o.length; i++) {
      if (!match(o[i])(arr[i])) {
        return false;
      }
    }
    return true;
  };
  setName(func, 'isArray');
  return func;
}

function isObject(o) {
  var func = function (obj) {
    if (typeof obj !== 'object') return false;
    for (var k in o) {
      if (!(k in obj)) return false;
      if (!match(o[k])(obj[k])) {
        return false;
      }
    }
    return true;
  };
  setName(func, 'isObject');
  return func;
}

function match(o) {
  var i, len, out = {};
  var func;
  if (typeof o === 'undefined') {
    func = isAnything;
  }
  else if (typeof o === 'string') {
    func = isString(o);
  }
  else if (typeof o === 'number') {
    func = isNumber(o);
  }
  else if (typeof o === 'boolean') {
    func = isBoolean(o);
  }
  else if (o === null) {
    func = isNull;
  }
  else if (o instanceof RegExp) {
    func = isRegExp(o);
  }
  else if (typeof o === 'function') {
    func = o;
  }
  else if (Array.isArray(o)) {
    func = isArray(o);
  }
  else if (typeof o === 'object') {
    func = isObject(o);
  }

  if (func) {
    return func;
  }
  throw new Error('Occamsrazor (match): The argument can be a string, number, boolean, null, regular expression, a function, an object or an array of strings');
};

module.exports = match;
