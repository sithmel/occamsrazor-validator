var isAnything = function (obj){
  return true;
};

var shortcut_validators = {
  match: function (o){
    var i, len, out = {};
    if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || o === null) {
      return function (s){
        return s === o;
      };
    }
    else if (o instanceof RegExp) {
      return function (s){
        return o.test(s);
      };
    }
    else if (typeof o === 'function'){
      return o;
    }
    else if (Array.isArray(o)){
      for(i = 0, len = o.length; i < len;i++){
        if (typeof o[i] !== 'string'){
          throw new Error("Occamsrazor (match): The argument can be a string, number, boolean, null, regular expression, a function, an object or an array of strings");
        }
        out[o[i]] = undefined;
      }
      return shortcut_validators.match(out);
    }
    else if (typeof o === 'object'){
      return function (obj){
        if (typeof obj !== "object") return false;
        for (var k in o){
          if (!(k in obj)) return false;
          if (typeof o[k] !== 'undefined'){
            if (!shortcut_validators.match(o[k])(obj[k])){
              return false;
            }
          }
          // undefined continue
        }
        return true;
      };
    }
    throw new Error("Occamsrazor (match): The argument can be a string, number, boolean, null, regular expression, a function, an object or an array of strings");
  },
  isPrototypeOf: function (proto){
    return function (obj){return proto.isPrototypeOf(obj);};
  },
  isInstanceOf: function (constructor){
    return function (obj){return obj instanceof constructor;};
  }
};

var _validator = function (baseScore, funcs){
  var k;
  funcs = funcs || [isAnything];
  var v = function validator(obj){
    var i, score, total = 0;
    for (i = 0; i < funcs.length; i++) {
      score = funcs[i](obj);
      if (!score) {
        return null;
      }
      total += score; // 1 + true === 2
    }
    return total + baseScore;
  };

  v.chain = function (func){
    return _validator(baseScore, funcs.concat(func));
  };

  v.score = function (){
    return funcs.length + baseScore;
  };

  v.important = function(bump){
    bump = bump || 64;
    return _validator(baseScore + bump, funcs);
  };

  // shortcut validators
  for (k in shortcut_validators){
    v[k] = (function (f){
      return function (){
        var args = Array.prototype.slice.call(arguments);
        return v.chain(f.apply(null, args));
      };
    }(shortcut_validators[k]));
  }

  return v;
};

//returns a validator (function that returns a score)
var validator = function (){
  return _validator(0);
};

validator.shortcut_validators = shortcut_validators;

module.exports = validator;
