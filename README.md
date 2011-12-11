JSFace is a library designed to facilitate object-oriented programming in JavaScript.

# Features

* Small footprint, no dependency, only 1K minimized+gzip.
* Work on both server and client side.
* Support CommonJS.
* Support singleton, trait, private properties.
* Plugins mechanism to extend itself.

# Usage

JSFace can be used on both server side and client side JavaScript.

In browser environment:

``` html
<script src="jsface.js" type="text/javascript"></script>
```

In NodeJS environment, first you need to install JSFace via npm:

``` sh
   npm install jsface
```

Then use it:

``` javascript
   var Class = require("jsface").Class;
```

## Define a simple class

``` javascript
   var Person = Class({
      constructor: function(name, age) {
         this.name = name;
         this.age  = age;
      },

      toString: function() {
         return this.name + "/" + this.age;
      }
   });

   var person = new Person("Rika", 20);
   person.toString();                           // "Rika/20"
```

## Define a sub-class

``` javascript
   var Student = Class(Person, {
      constructor: function(id, name, age) {
         this.id = id;
         this.$super(name, age);               // Invoke parent's constructor
      },

      toString: function() {
         return this.id + "/" + this.$super(); // Invoke parent's toString method
      }
   });

   var student = new Student(1, "Rika", 20);
   student.toString();                         // "1/Rika/20"
```

## Singleton class

``` javascript
   var Util = Class({
      $singleton: true,

      echo: function(obj) {
         return obj;
      }
   });

   Util.echo(2012);                            // 2012
```

## Static properties

JSFace supports Java-style static properties. Meaning they are accessible on both class and instance levels.

``` javascript
   var Person = Class({
      $statics: {
         MIN_AGE:   1,
         MAX_AGE: 150,

         isValidAge: function(age) {
            return age >= this.MIN_AGE && age <= this.MAX_AGE;
         }
      },

      constructor: function(name, age) {
         this.name = name;
         this.age  = age;
      }
   });

   var person = new Person("Rika", 20);

   Person.MIN_AGE === person.MIN_AGE;          // true
   Person.MAX_AGE === person.MAX_AGE;          // true
   Person.isValidAge(0);                       // false
   person.isValidAge(person.age);              // true
```

## Private properties

``` javascript
   var Person = Class(function() {
      var MIN_AGE =   1,                       // private variables
          MAX_AGE = 150;

      function isValidAge(age) {               // private method
         return age >= MIN_AGE && age <= MAX_AGE;
      }

      return {
         constructor: function(name, age) {
            if ( !isValidAge(age)) {
               throw "Invalid parameter";
            }

            this.name = name;
            this.age  = age;
         }
      };
   });
```

## Mixin

JSFace provides a powerful mechanism to support mixin. Reusable code can be mixed into almost anything.

Mixin can be bound when you define classes:

``` javascript
   var Options = Class({
      setOptions: function(opts) {
         this.opts = opts;
      }
   });

   var Events = Class({
      bind: function(event, fn) {
         return true;
      },
      unbind: function(event, fn) {
         return false;
      }
   });

   var Person = Class({
      constructor: function(name, age) {
         this.name = name;
         this.age  = age;
      }
   });

   // Student inherits Person and extends properties from Options and Events
   var Student = Class([ Person, Options, Events ], {
      constructor: function(id, name, age) {}
   });

   var student = new Student(1, "Rika", 20);
   student.setOptions({ foo: true });          // student.opts === { foo: true }
   student.bind();                             // true
   student.unbind();                           // false
```

Or after defining classes:

``` javascript
   var extend = jsface.extend;                 // NodeJS environment: var extend = require("jsface").extend;
```

``` javascript
   var Student = Class(Person, {
      constructor: function(id, name, age) {
   });

   extend(Student, [ Options, Events ]);
```

Mixin with instance:

``` javascript
   var person = new Person("Rika", 20);

   extend(person, Options);
   person.setOptions({ foo: true });
```
 Mixin with native classes:

``` javascript
   extend(Array.prototype, {
      trim: function() {
         return this.replace(/^\s+|\s+$/g, "");
      }
   });

   "   Hello World    ".trim();                // "Hello World"
```
## No conflict

In browser environment, you might be using another library which also introduces the global namespace Class. JSFace can return the original Class back to the library claims it with a call to jsface.noConflict().

``` javascript
jsface.noConflict();

// Code that uses other library's Class can follow here
```

Actually, Class is an alias of jsface.Class:

``` javascript
   jsface.noConflict();
   
   // Code that uses other library's Class can follow here

   // Define classes by using jsface.Class directly
   var Person = jsface.Class({
   });
```

# Bug tracker

Have a bug? Please [create an issue here](https://github.com/tannhu/jsface/issues) on GitHub!

# Beyond the scope of this readme

Method overloadings, type checking and pointcuts (available in versions prior to 2.0.0) are being implemented as plugins.

More use cases are covered in [unit tests](https://github.com/tannhu/jsface/tree/master/test)
(I'm using [QUnit](https://github.com/jquery/qunit)).

# License

JSFace is available under the terms of the [MIT license](https://github.com/tannhu/jsface/blob/master/MIT-LICENSE.txt).
