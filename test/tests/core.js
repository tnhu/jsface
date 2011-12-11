var context    = this,
    extend     = jsface.extend,
    each       = jsface.each,
    isMap      = jsface.isMap,
    isArray    = jsface.isArray,
    isFunction = jsface.isFunction,
    isString   = jsface.isString,
    isClass    = jsface.isClass;

// --------- UTILITIES --------- //

test("Loop with each over a string", function() {
   each("123456", function(e, index, st) {
      ok(st[index] === e, "invalid each loop behavior over a string");
   });
});

test("Loop with each over an array", function() {
   each([ 1, 2, 3, 4, 5, 6, 7 ], function(e, index, array) {
      ok(array[index] === e, "invalid each loop behavior over an array");
   });
});

test("Loop with each over an array", function() {
   each([ 1, 2, 3, 4, 5, 6, 7 ], function(e, index, array) {
      ok(array[index] === e, "invalid each loop behavior over an array");
   });
});

test("Loop with each over a map", function() {
   each({ a: 1, b: 2, c: 3, d: 4 }, function(key, value, map) {
      ok(map[key] === value, "invalid each loop behavior over a map");
   });
});

test("each returned value over a string", function() {
   var result = each("123456", function(e, index, st) {
      return e + e;
   });
   ok(result.join("") === "112233445566", "invalid each returned value over a string");
});

test("each returned value over an array", function() {
   var result = each([ 1, 2, 3, 4, 5, 6 ], function(e, index, st) {
      return e*2;
   });
   ok(result.join("") === "24681012", "invalid each returned value over an array");
});

test("each returned value over a map", function() {
   var result = each({ a: 1, b: 2, c: 3, d: 4 }, function(key, value, map) {
      return value*2;
   });
   ok(result.join("") === "2468", "invalid each returned value over a map");
});

test("Loop with each over a number", function() {
   each(1, function(value) {
      ok(1 === value, "invalid each loop behavior over a single number");
   });
});

test("Break each loop", function() {
   var sum = 0;
   each([ 2, 3, 4, 5, 6, 7 ], function(value) {
      sum += value;
      if (value === 4) { return Infinity; }
   });
   ok(9 === sum, "invalid each loop break behavior");
});

test("Check type with isMap", function() {
   ok(isMap({}), "jsface.isMap works incorrectly");
   ok(isMap({ one: 1, two: 2 }), "jsface.isMap works incorrectly");

   ok( !isMap(), "jsface.isMap works incorrectly");
   ok( !isMap(""), "jsface.isMap works incorrectly");
   ok( !isMap("Hello"), "jsface.isMap works incorrectly");
   ok( !isMap([]), "jsface.isMap works incorrectly");
   ok( !isMap([ 1, 2, 3 ]), "jsface.isMap works incorrectly");
   ok( !isMap(1), "jsface.isMap works incorrectly");
});

test("Check type with jsface.isMap on iframe", function() {
   var iframe, IObject;

   iframe = document.createElement("iframe");
   document.body.appendChild(iframe);
   IObject = window.frames[window.frames.length - 1].Object;

   var map = new IObject();
   map.one = 1;
   map.two = 2;

   ok(isMap(map), "jsface.isMap works incorrectly in iframe");
   document.body.removeChild(iframe);
});

test("Check type with jsface.isArray", function() {
   ok(isArray([]), "jsface.isArray works incorrectly");
   ok(isArray([ 1, 2, 3, 4 ]), "jsface.isArray works incorrectly");
   ok( !isArray(), "jsface.isArray works incorrectly");

   // jsface.isArray does not consider String as Array of characters
   ok( !isArray(""), "jsface.isArray works incorrectly");
   ok( !isArray("Hello"), "jsface.isArray works incorrectly");
   ok( !isArray({}), "jsface.isArray works incorrectly");
   ok( !isArray({ one: 1, two: 2 }), "jsface.isArray works incorrectly");
   ok( !isArray(1), "jsface.isArray works incorrectly");
});

test("Check type with jsface.isArray on iframe", function() {
   var iframe, IArray, array;

   iframe = document.createElement("iframe");
   document.body.appendChild(iframe);
   IArray = window.frames[window.frames.length - 1].Array;

   array = new IArray(1, 2, 3);

   ok(isArray(array), "jsface.isArray works incorrectly in iframe");
   document.body.removeChild(iframe);
});

test("Check type with jsface.isFunction", function() {
   ok(isFunction(function(){}), "jsface.isFunction works incorrectly");
   ok( !isFunction([]), "jsface.isFunction works incorrectly");
   ok( !isFunction([ 1, 2, 3, 4 ]), "jsface.isFunction works incorrectly");
   ok( !isFunction(), "jsface.isFunction works incorrectly");
   ok( !isFunction(""), "jsface.isFunction works incorrectly");
   ok( !isFunction("Hello"), "jsface.isFunction works incorrectly");
   ok( !isFunction({}), "jsface.isFunction works incorrectly");
   ok( !isFunction({ one: 1, two: 2 }), "jsface.isFunction works incorrectly");
   ok( !isFunction(1), "jsface.isFunction works incorrectly");
});

test("Check type with jsface.isFunction on iframe", function() {
   var iframe, IFunction, fn;

   iframe = document.createElement("iframe");
   document.body.appendChild(iframe);
   IFunction = window.frames[window.frames.length - 1].Function;

   fn = new IFunction();
   ok(isFunction(fn), "jsface.isFunction works incorrectly");
   document.body.removeChild(iframe);
});

test("Check type with jsface.isClass", function() {
   ok(isClass(function(){}), "jsface.isClass works incorrectly on function");
   ok( !isClass(), "jsface.isClass works incorrectly passing empty param");
   ok( !isClass(undefined), "jsface.isClass works incorrectly undefined");
   ok( !isClass(null), "jsface.isClass works incorrectly on null");
   ok( !isClass(""), "jsface.isClass works incorrectly empty string");
   ok( !isClass("   "), "jsface.isClass works incorrectly blank string");
   ok( !isClass({}), "jsface.isClass works incorrectly empty map");
   ok( !isClass([]), "jsface.isClass works incorrectly empty array");
   ok( !isClass(0), "jsface.isClass works incorrectly on 0");
   ok( !isClass(1), "jsface.isClass works incorrectly on 1");
   ok( !isClass(true), "jsface.isClass works incorrectly on true");
   ok( !isClass(false), "jsface.isClass works incorrectly on false");
   ok( !isClass([ 1, 2, 3, 4 ]), "jsface.isClass works incorrectly on array");
   ok( !isClass("Hello"), "jsface.isClass works incorrectly on string");
   ok( !isClass({ one: 1, two: 2 }), "jsface.isClass works incorrectly on map");

   // jsface's Class/Singleton
   var Foo = Class({}),
       Bar = Class({
          constructor: function(){}
       }),
       Util = Class({
          $singleton: true
       });
   ok(isClass(Foo), "jsface.isClass works incorrectly on an empty class");
   ok(isClass(Bar), "jsface.isClass works incorrectly on a simple class");
   ok( !isClass(Util), "jsface.isClass works incorrectly a singleton class (singleton is a map, not a class)");
});

asyncTest("CommonJS support", function() {
   // this unit test is run on browsers for sure
   ok(jsface, "jsface must be available globally");
   ok(extend, "extend must be available globally");
   ok(Class, "Class must be available globally");

   // simulate CommonJS
   context.module = { exports: {} };

   // reload jsface.js
   var script  = document.createElement("script");
   script.src  = "../jsface.js";
   script.type = "text/javascript";

   script.onload = function() {
      var exports = context.module.exports;
      start();

      ok(exports.Class, "Class must be available in exports");
      ok(exports.each, "each must be available in exports");
      ok(exports.isMap, "isMap must be available in exports");
      ok(exports.isArray, "isArray must be available in exports");
      ok(exports.isFunction, "isFunction must be available in exports");
      ok(exports.isString, "isString must be available in exports");
      ok(exports.isClass, "isClass must be available in exports");

      script.onload = null;
      delete context.module;
   }

   document.body.appendChild(script);
});

asyncTest("noConflict support", function() {
   var clazz     = context.Class;
   context.Class = function() { return 1; };

   // reload jsface.js
   var script  = document.createElement("script");
   script.src  = "../jsface.js";
   script.type = "text/javascript";

   script.onload = function() {
      jsface.noConflict();
      ok(Class() === 1, "noConflict works incorrectly");

      start();
      script.onload = null;
      context.Class = clazz;
   }

   document.body.appendChild(script);
});

// --------- CLASS --------- //

test("Class with invalid params", function() {
   raises(function() {
      Class(12345);
   }, "An exception must be thrown for invalid params");
});

test("Special syntax", function() {
   var Test = Class();
   ok(isClass(Test), "Class defination must be a class");

   var Foo = Class({});
   ok(isClass(Foo), "Class defination must be a class");

   var Bar = Class("Hello World", {});
   ok(isClass(Bar), "Class defination must be a class");

});

test("Create a simple class", function() {
   var Foo = Class({
      constructor: function(name) {
         this.name = name;
      },

      sayHi: function() {
         return "Hello World " + this.name;
      }
   });

   var foo = new Foo("John Rambo");

   ok(isFunction(Foo), "Class defination must be a function");
   ok(isClass(Foo), "Class defination must be a class");
   ok(isMap(foo), "Class instance must be a map");
   ok(foo.sayHi() === "Hello World John Rambo", "Error invoking method on class instance");
   ok(foo.name === "John Rambo", "Invalid constructor initialization");
});

test("Class with default constructor", function() {
   var Foo = Class({
      sayBye: function() {
         return "Bye!";
      }
   });

   var foo = new Foo();

   ok(isFunction(Foo), "Default constructor must be a function");
   ok(foo.sayBye() === "Bye!", "Error invoking method on class instance");
});

test("Private properties and methods", function() {
   var Foo = Class(function() {
      var bye = "Bye!";

      function hi() {
         return "Hi!";
      }

      return {
         sayHi: hi,

         sayBye: function() {
            return bye;
         }
      };
   });

   var foo = new Foo();

   ok(isFunction(Foo), "Default constructor must be a function");
   ok(foo.sayBye() === "Bye!", "Error invoking method on class instance");
   ok(foo.sayHi() === "Hi!", "Invalid private implementation");
   ok( !foo.hi, "Invalid private implementation");
   ok( !foo.bye, "Invalid private implementation");
});

test("Create a sub class", function() {
   var Foo = Class({
      constructor: function(name) {
         this.name = name;
      },

      welcome: function() {
         return "Welcome " + this.name;
      },

      sayHi: function() {
         return "Hello World " + this.name;
      }
   });

   var Bar = Class(Foo, {
      constructor: function(name) {
         this.$super(name);
      },

      sayHi: function() {
         return this.$super();
      },

      sayBye: function() {
         return "Bye!";
      }
   });

   var bar = new Bar("John Rambo");

   ok(bar.name === "John Rambo", "Subclass must be able to invoke parent constructor");
   ok(bar.welcome() === "Welcome John Rambo", "Subclass must be able to inherit parent methods");
   ok(bar.sayHi() === "Hello World John Rambo", "Subclass must be able to invoke parent method");
   ok(bar.sayBye() === "Bye!", "Error invoking subclass method");
});

test("Multiple level class inheritance", function() {
   var Foo = Class({
      constructor: function(name) {
         this.name = name;
      },

      sayHi: function() {
         return "Hello " + this.name;
      }
   });

   var Bar = Class(Foo, {
      constructor: function(name) {
         this.$super(name);
      },

      sayHi: function() {
         return this.$super();
      }
   });

   var Child = Class(Bar, {
      constructor: function(name) {
         this.$super(name);
      },

      sayHi: function() {
         return this.$super();
      }
   });

   var child = new Child("John Rambo");

   ok(child.name === "John Rambo", "Subclass must be able to invoke parent constructor");
   ok(child.sayHi() === "Hello John Rambo", "Subclass must be able to invoke parent method");
});

test("Static methods", function() {
   var Bar = Class({
      constructor: function(name) {
         this.name = name;
      },

      $statics: {
         sayBye: function() {
            return "Bye!";
         }
      }
   });

   var bar = new Bar("John Rambo");

   ok(Bar.sayBye() === "Bye!", "Error invoking static method");
   ok(bar.sayBye() === "Bye!", "Error invoking static method from class instance");
   ok(bar.sayBye === Bar.sayBye, "Static method must be the same on both class and class instance");
});

test("Singleton class", function() {
   var Foo = Class({
      $singleton: true,

      sayHi: function() {
         return "Hello World";
      }
   });

   ok(isMap(Foo), "Singleton class must be a map object");
   ok(Foo.sayHi() === "Hello World", "Error invoking method on singleton class");
});

test("Singleton inheritance", function() {
   var Foo = Class({
      $singleton: true,

      sayHi: function() {
         return "Hello World";
      }
   });

   var Bar = Class(Foo, {
      $singleton: true,

      sayBye: function() {
         return "Bye!";
      }
   });

   ok(isMap(Bar), "Singleton class must be a map object");
   ok(Bar.sayHi() === "Hello World", "Error invoking method on singleton class");
   ok(Bar.sayBye() === "Bye!", "Error invoking method on singleton class");
});

test("Inherit from a singleton", function() {
   var Foo = Class({
      $singleton: true,

      sayHi: function() {
         return "Hello World";
      }
   });

   var Bar = Class(Foo, {
      sayBye: function() {
         return "Bye!";
      }
   });

   var bar = new Bar();

   ok(isClass(Bar), "Class defination must be a class");
   ok(bar.sayHi === Bar.sayHi, "Static method must be the same on both class and class instance");
   ok(bar.sayHi === Foo.sayHi, "Static method must be the same on both class and class instance");
   ok(Foo.sayHi === Bar.sayHi, "Static method must be the same on both class");
   ok(Bar.sayHi() === "Hello World", "Error invoking method on singleton class");
   ok(bar.sayHi() === "Hello World", "Error invoking method on singleton class");
   ok(bar.sayBye() === "Bye!", "Error invoking method on class");
});

test("Mixin: class extends class", function() {
   var Foo = Class({
      constructor: function(name) {
         this.name = name;
      },

      welcome: function() {
         return "Welcome " + this.name;
      },

      sayHi: function() {
         return "Hello World " + this.name;
      }
   });

   var Bar = Class({
      constructor: function(name) {
         this.name = name;
      },

      welcome: function() {
         return "invalid";
      },

      sayBye: function() {
         return "Bye!";
      }
   });

   extend(Bar, Foo); // note: extend is different from inherit: Foo's properties will override Bar's properties

   var bar = new Bar("John Rambo");

   ok(bar.name === "John Rambo", "Invalid extend() behavior, constructor must be bound correctly");
   ok(bar.welcome() === "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
   ok(bar.sayHi() === "Hello World John Rambo", "Invalid extend() behavior");
   ok(bar.sayBye() === "Bye!", "Invalid extend() behavior");
});

test("Mixin: class extends singleton", function() {
   var Foo = Class({
      $singleton: true,

      welcome: function() {
         return "Welcome " + this.name;
      },

      sayHi: function() {
         return "Hello World " + this.name;
      }
   });

   var Bar = Class({
      constructor: function(name) {
         this.name = name;
      },

      welcome: function() {
         return "invalid";
      },

      sayBye: function() {
         return "Bye!";
      }
   });

   extend(Bar, Foo);

   var bar = new Bar("John Rambo");

   ok(bar.welcome() === "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
   ok(bar.sayHi() === "Hello World John Rambo", "Invalid extend() behavior");
   ok(bar.sayBye() === "Bye!", "Invalid extend() behavior");
});

test("Mixin: singleton extends class", function() {
   var Foo = Class({
      $singleton: true,

      welcome: function() {
         return "Welcome " + this.name;
      },

      sayHi: function() {
         return "Hello World " + this.name;
      }
   });

   var Bar = Class({
      $statics: {
         sample: 1,
         fn: function() { return 2; }
      },
      constructor: function(name) {
         this.name = name;
      },

      welcome: function() {
         return "invalid";
      },

      sayBye: function() {
         return "Bye!";
      }
   });

   extend(Foo, Bar);

   ok(Foo.sample === 1, "Invalid extend() behavior, property must be overriden properly");
   ok(Foo.fn() === 2, "Invalid extend() behavior");
});

test("Mixin: class extends multiple classes", function() {
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

   var Foo = Class({
      constructor: function(name) {
         this.name = name;
      },
   });

   extend(Foo, [ Options, Events ]);

   var bar = new Foo("Bar");
   bar.setOptions("nothing");

   ok(bar.name === "Bar", "Invalid extend() behavior, constructor must be bound correctly");
   ok(bar.opts === "nothing", "Invalid extend() behavior, constructor must be bound correctly");
   ok(bar.bind(), "Invalid extend() behavior");
   ok( !bar.unbind(), "Invalid extend() behavior");
});


test("Mixin: class extends both class and instance", function() {
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

   var Foo = Class({
      constructor: function(name) {
         this.name = name;
      },
   });

   extend(Foo, [ Options, new Events() ]);

   var foo = new Foo("Bar");
   foo.setOptions("nothing");

   ok(foo.name === "Bar", "Invalid extend() behavior, constructor must be bound correctly");
   ok(foo.opts === "nothing", "Invalid extend() behavior, constructor must be bound correctly");
   ok(Foo.bind(), "Invalid extend() behavior");
   ok( !Foo.unbind(), "Invalid extend() behavior");
   ok(foo.bind(), "Invalid extend() behavior");
   ok( !foo.unbind(), "Invalid extend() behavior");
});

test("Mixin: extending native objects", function() {
   extend(Array, {
      sum: function() {
         var s = 0;
         each(this, function(value) {
            s += value;
         });
         return s;
      }
   });

   var a = [ 1, 2, 3, 4, 5 ];

   ok(a.sum, "Invalid extend() binding native object");
   ok(Array.sum, "Invalid extend() binding native object");
   ok(Array.prototype.sum, "Invalid extend() binding native object");
   ok(a.sum() === 15, "Invalid extend() binding native object");
});

test("Mixin: extending native objects (prototype only)", function() {
   delete Array.sum;

   extend(Array.prototype, {
      sum: function() {
         var s = 0;
         each(this, function(value) {
            s += value;
         });
         return s;
      }
   });

   var a = [ 1, 2, 3, 4, 5 ];

   ok(a.sum, "Invalid extend() binding native object");
   ok( !Array.sum, "Invalid extend() binding native object");
   ok(Array.prototype.sum, "Invalid extend() binding native object");
   ok(a.sum() === 15, "Invalid extend() binding native object");
});

// --------- PLUGINS --------- //

test("$ready plugin: class notifies itself", function() {
   var notified = false;

   var Foo = Class({
      $ready: function(clazz, api, parent) {
         notified = true;
         ok(this === clazz, "$ready works incorrectly");
         ok(isFunction(api.$ready), "$ready works incorrectly");
         ok(isFunction(api.echo), "$ready works incorrectly");
         ok(isFunction(clazz.prototype.echo), "$ready works incorrectly");
         ok( !parent, "$ready works incorrectly");
      },
      echo: function(o) {
         return o;
      }
   });

   ok(notified, "$ready must be executed");
});

test("$ready plugin: class is notified when its subclass is ready", function() {
   var notified = false;

   var Foo = Class({
      $ready: function(clazz, api, parent) {
         notified = true;

         if (this !== clazz) {
            ok(api.echo2, "$ready works incorrectly");
            ok( !api.$ready, "$ready works incorrectly");
            ok(isFunction(clazz.prototype.echo2), "$ready works incorrectly");
         }
      },
      echo: function(o) {
         return o;
      }
   });

   ok(notified, "$ready must be executed");

   var Bar = Class(Foo, {
      echo2: function(o) {
         return o;
      }
   });
});

test("Develop a Class plugin", function() {
   var Logger = Class({
      log: function(msg) {
         console.log(msg);
      }
   });

   Class.plugins.$log = function(clazz, parent, api) {
      extend(clazz, Logger);
   }

   var Foo = Class();
   var foo = new Foo();

   ok(isFunction(Foo.prototype.log), "Class plugins mechanism works incorrectly");
   ok(isFunction(foo.log), "Class plugins mechanism works incorrectly");
   delete Class.plugins.$log;
});


