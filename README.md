occamsrazor-validator
=====================
[![Build Status](https://travis-ci.org/sithmel/occamsrazor-validator.svg?branch=master)](https://travis-ci.org/sithmel/occamsrazor-validator)

The main goal of the library is to be used for duck-typing. It contains a validator object that allows to easily check any aspect of an object/value. It is not a schema validator library. For this reason:

* It detects what an object is rather than what it is not
* An object passing the validation returns a "validationResult". This object has a value, based on how many validation steps has passed.

It is a part of occamsrazor (https://github.com/sithmel/occamsrazor.js) that uses this library for picking the right adapter for a specific set of arguments.

Importing the library
=====================
```js
var validator = require('occamsrazor-validator');
```

What is a  validators
=====================
Ultimately a validator is a function. When it runs against an object, it returns null or a score (wrapped in a validationResult for convenience).
Null means that an object doesn't fit in the validator's constraints.
The score represent how well the object fits (its specificity). For example:

```js
var isAnything = validator();
```

"validator()" creates the simplest validator. It matches everything with score 1:
```js
isAnything('hello').value();     // 1
isAnything({width: 10}).value(); // 1
```
You can chain a function to create a more strict validation:
```js
var hasWheels = isAnything.match(function (obj){
    return 'wheels' in obj;
});
```
or
```js
var hasWheels = validator().match(function (obj){
    return 'wheels' in obj;
});
```
So for example, the score of this new validator will be 2::
```js
hasWheels({wheels: 4}).value(); // 2
hasWheels({feet: 2});           // returns null
```
You can go on having a more specific validator:
```js
var hasWheelsAndWings = hasWheels.match(function (obj){
    return 'wings' in obj;
});
```
Every validator has a function "score" that returns its specificity:
```js
isAnything.score()        // 1
hasWheels.score()         // 2
hasWheelsAndWings.score() // 3
```
In order to write validators you can use duck typing, type checking or whatever check you want to use:
```js
// duck typing
var has_wings = validator().match(function (obj){
    return 'wings' in obj;
});

//type checking
var is_a_car = validator().match(function (obj){
    return Car.prototype.isPrototypeOf(obj);
});

//other
var is_year = validator().match(function (obj){
    var re = /[0-9]{4}/;
    return !!obj.match(re);
});
```
The "match" method allows to extend a validator using a terse syntax. You have already seen that it can take a function as argument.
You can also pass a string or a regular expression for matching a string:
```js
var is_hello = validator().match('hello');
var contains_nuts = validator().match(/nut/);

is_hello('hello');
contains_nuts('hazelnut');
```
Or numbers::
```js
var is_ten = validator().match(10);
is_ten(10);
```
It works for booleans and null in the same way.
If you pass an array it will match with any element of an input array with its content:
```js
var has_1_2 = validator().match([1, 2]);
```
Finally you can perform deep property checking using an object and combining the previous checks::
```js
// match with width and height equal to 10
var has_width_and_height_10 = validator().match({width: 10, height: 10});

// match with a center attribute with x and y subattributes
var has_center = validator().match({center: {x: undefined, y: undefined}});

// match if obj.recipe.ingredients is a string and match with /nuts/
var recipe_has_nuts = validator().match({recipe: {ingredients: /nuts/}});

// match if obj.weight is a number bigger than 100
var is_heavy = validator().match({weight: function (obj){return obj > 100}});
```
There are other 3 helpers available::
```js
var is_prototype_rect = validator().isPrototypeOf(rect.prototype);
var is_instance_rect = validator().isInstanceOf(Rect);
var has_attr = validator().has('width', 'height');
```
If you need a custom validator you can extend the object validator.shortcut_validators::
```js
validator.shortcut_validators.isSquare = function (){
    return function (obj){
        return 'width' in obj && 'height' in obj && obj.width === obj.height;
    };
};
```
Of course you can combine all the methods we have seen so far::
```js
// this will have a specificity of 4
var is_instance_a_square = validator()
    .isInstanceOf(Rect)
    .has('width', 'height')
    .isSquare();
```

Combine validators
------------------
You might want to match a group of values. You can do it combine as many validators you want:
```js
var isNumber = validator().match(function (n) {
  return typeof n === 'number';
});
var is5 = isNumber.match(5);
var is8 = isNumber.match(8);
var v = combineValidators(isNumber, is5, is8);
```
and then trying to make it match:
```js
v(1, 5, 8).value(); // it will return [2, 3, 3]
```
If all values match, the validator will return a validationResult with value [2, 3, 3].
The elements of the array are the values of the respective validators.
If one of them doesn't match the result will be null:
```js
v(1, 5, 5); // it will return null
```
When the value returned is an array it is compared in this way (alphabetically):
```js
[2, 3, 4] > [2, 2, 5]
[1] < [1, 2]
[2] > [1, 9, 5]
```

Sort and compare results
------------------------
The result validator object has an useful property. It can be sorted and compared as it was a basic js type.
```js
r0 > r1
var results = [r0, r1, r2, r3];
r.sort();
```

Syntax
======

Validator function
------------------

Syntax:
```js
validator();
```

Returns a generic validator. It will validate every object with score 1.

validator().score
-----------------------------

Syntax:
```js
a_validator.score();
```
Returns the score returned by this validator. It can be useful for debugging or introspection.

validator().important
---------------------------------

Syntax:
```js
a_validator.important([n]);
```
It bumps the score by n (default to 64).

validator().match
-----------------------------

Add a check to the validator, using an expressive syntax.

Syntax:
```js

// execute a function against the value: returns true or false
var validator = validator().match(function);

// matches if value is equal to string
var validator = validator().match(string);

// matches if value is equal to null
var validator = validator().match(null);

// matches if value is equal to the boolean
var validator = validator().match(boolean);

// matches if value is equal to the number
var validator = validator().match(number);

// matches if value matches with the regular expression
var validator = validator().match(regular_expression);

// matches if these items matches respectively
var validator = validator().match([items]);

// deep matching
var validator = validator().match({propName1: "string", propName2: {propName3: "string"}});
```
The last two forms allow to perform the validation check recursively, walking the properties of the object/array.
In a property is undefined the value will match any value.

For example:
```js
var hasCenterX = validator().match({center: {x: undefined}});
// will match {center: {x: "10"}}

var hasCenterX10 = validator().match({center: {x: "10"}});
// will match {center: {x: "10"}} but not {center: {x: "11"}}

var hasCenter5or10 = validator().match({center: {x : function (c){
  return c === "5" || c === "10";
}}});
// will match {center: {x: "5"}} or {center: {x: "10"}}
```

validator().isPrototypeOf
-------------------------------------
Check if an object is a prototype of another.

Syntax:
```js
var validator = validator().isPrototypeOf(obj);
```

validator().instanceOf
-------------------------------------
Check if an object is an instance of a constructor.

Syntax:
```js
var validator = validator().instanceOf(ContructorFunc);
```

validator().has
-------------------------------------
Check if an object has attributes with a specific names.

Syntax:
```js
var validator = validator().has(attr1, attr2, ...);
```

validator.shortcut_validators
-------------------------------
It is an object where you can add your shortcut validators.
"match" and "isPrototypeOf" are added here but you can add your own if you need.
