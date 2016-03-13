occamsrazor-validator
=====================
[![Build Status](https://travis-ci.org/sithmel/occamsrazor-validator.svg?branch=master)](https://travis-ci.org/sithmel/occamsrazor-validator)

This is an helper library that helps to perform variable validation with a simple syntax.
The main goal of the library is to be used for duck-typing. For this reason:

* It detects what an object is rather than what it is not
* It returns a "score" (or null). The score is based on how many validation pass and gives you an index of how specific is a validation

It is a part of occamsrazor (https://github.com/sithmel/occamsrazor.js) that uses this library for picking the right adapter for a specific set of arguments.

Importing the library
=====================
```js
var validator = require('occamsrazor-validator');
```

What is a  validators
=====================
Ultimately a validator is a function. When it runs against an object, it returns null or a score.
Null value means that an object doesn't fit in the validator's constraints.
The score represent how well the object fits (its specificity). For example:

```js
var isAnything = validator();
```

"validator()"" creates the simplest validator. It matches everything with score 1:
```js
isAnything('hello'); // returns 1
isAnything({width: 10}); // returns 1
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
hasWheels({wheels: 4}); // returns 2
hasWheels({feet: 2});   // returns null
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
If you pass an array of strings it will match with an object containing all the attributes with those names:
```js
var has_width_and_height = validator().match(['width', 'height']);
```
Finally you can perform deep property checking using an object and combining the previous checks::
```js
// match with width and height equal to 10
var has_width_and_height_10 = validator().match({width: 10, height: 10});

// match with a center attribute with x and y subattributes
var has_center = validator().match({center: ['x', 'y']});

// match if obj.recipe.ingredients is a string and match with /nuts/
var recipe_has_nuts = validator().match({recipe: {ingredients: /nuts/}});

// match if obj.weight is a number bigger than 100
var is_heavy = validator().match({weight: function (obj){return obj > 100}});
```
There are other 2 helpers available for checking against the prototype or the constructor function::
```js
var is_prototype_rect = validator().isPrototypeOf(rect.prototype);
var is_instance_rect = validator().isInstanceOf(Rect);
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
    .match(['width', 'height'])
    .isSquare();
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

Add a check to the validator, it uses a special syntax (used by default by .add, .one).

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

// matches if value matches with the regular expression
var validator = validator().match(regular_expression);

// matches if these properties are defined in the object
var validator = validator().match([array of property names]);

// deep matching
var validator = validator().match({propName1: "string", propName2: {propName3: "string"}});
```
This last form allows to perform the validation check recursively, walking the properties of the object.
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

validator.shortcut_validators
-------------------------------
It is an object where you can add your shortcut validators.
"match" and "isPrototypeOf" are added here but you can add your own if you need.
