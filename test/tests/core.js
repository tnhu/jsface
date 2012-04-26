var context    = this,
    extend     = jsface.extend,
    isMap      = jsface.isMap,
    isArray    = jsface.isArray,
    isFunction = jsface.isFunction,
    isString   = jsface.isString,
    isClass    = jsface.isClass;

// --------- UTILITIES --------- //

test("Check type with isMap", function() {
  equal(isMap({}), true, "jsface.isMap works incorrectly");
  equal(isMap({ one: 1, two: 2 }), true, "jsface.isMap works incorrectly");

  equal( !isMap(), true, "jsface.isMap works incorrectly");
  equal( !isMap(""), true, "jsface.isMap works incorrectly");
  equal( !isMap("Hello"), true, "jsface.isMap works incorrectly");
  equal( !isMap([]), true, "jsface.isMap works incorrectly");
  equal( !isMap([ 1, 2, 3 ]), true, "jsface.isMap works incorrectly");
  equal( !isMap(1234), true, "jsface.isMap works incorrectly");
});

test("Check type with jsface.isMap on iframe", function() {
  var frame, iframe, IObject;

  iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  frame = window.frames[window.frames.length - 1];

  // getObject returns JavaScript Object in iframe context
  frame.getObject = function() {
    return Object;
  };

  IObject = frame.getObject();

  var map = new IObject();
  map.one = 1;
  map.two = 2;

  equal(isMap(map), true, "jsface.isMap works incorrectly in iframe");
  document.body.removeChild(iframe);
});

test("Check type with jsface.isArray", function() {
  equal(isArray([]), true, "jsface.isArray works incorrectly");
  equal(isArray([ 1, 2, 3, 4 ]), true, "jsface.isArray works incorrectly");
  equal( !isArray(), true, "jsface.isArray works incorrectly");

  // jsface.isArray does not consider String as Array of characters
  equal( !isArray(""), true, "jsface.isArray works incorrectly");
  equal( !isArray("Hello"), true, "jsface.isArray works incorrectly");
  equal( !isArray({}), true, "jsface.isArray works incorrectly");
  equal( !isArray({ one: 1, two: 2 }), true, "jsface.isArray works incorrectly");
  equal( !isArray(1), true, "jsface.isArray works incorrectly");
});

test("Check type with jsface.isArray on iframe", function() {
  var frame, iframe, IArray, array;

  iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  frame = window.frames[window.frames.length - 1];
  frame.getArray = function() {
    return Array;
  };

  IArray = frame.getArray();

  array = new IArray(1, 2, 3);

  equal(isArray(array), true, "jsface.isArray works incorrectly in iframe");
  document.body.removeChild(iframe);
});

test("Check type with jsface.isFunction", function() {
  equal(isFunction(function(){}), true, "jsface.isFunction works incorrectly");
  equal( !isFunction([]), true, "jsface.isFunction works incorrectly");
  equal( !isFunction([ 1, 2, 3, 4 ]), true, "jsface.isFunction works incorrectly");
  equal( !isFunction(), true, "jsface.isFunction works incorrectly");
  equal( !isFunction(""), true, "jsface.isFunction works incorrectly");
  equal( !isFunction("Hello"), true, "jsface.isFunction works incorrectly");
  equal( !isFunction({}), true, "jsface.isFunction works incorrectly");
  equal( !isFunction({ one: 1, two: 2 }), true, "jsface.isFunction works incorrectly");
  equal( !isFunction(1), true, "jsface.isFunction works incorrectly");
});

test("Check type with jsface.isFunction on iframe", function() {
  var frame, iframe, IFunction, fn;

  iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  frame = window.frames[window.frames.length - 1];
  frame.getFunction = function() {
    return Function;
  };

  IFunction = frame.getFunction();

  fn = new IFunction();
  equal(isFunction(fn), true, "jsface.isFunction works incorrectly");
  document.body.removeChild(iframe);
});

test("Check type with jsface.isClass", function() {
  equal(isClass(function(){}), true, "jsface.isClass works incorrectly on function");
  equal( !isClass(), true, "jsface.isClass works incorrectly passing empty param");
  equal( !isClass(undefined), true, "jsface.isClass works incorrectly undefined");
  equal( !isClass(null), true, "jsface.isClass works incorrectly on null");
  equal( !isClass(""), true, "jsface.isClass works incorrectly empty string");
  equal( !isClass("   "), true, "jsface.isClass works incorrectly blank string");
  equal( !isClass({}), true, "jsface.isClass works incorrectly empty map");
  equal( !isClass([]), true, "jsface.isClass works incorrectly empty array");
  equal( !isClass(0), true, "jsface.isClass works incorrectly on 0");
  equal( !isClass(1), true, "jsface.isClass works incorrectly on 1");
  equal( !isClass(true), true, "jsface.isClass works incorrectly on true");
  equal( !isClass(false), true, "jsface.isClass works incorrectly on false");
  equal( !isClass([ 1, 2, 3, 4 ]), true, "jsface.isClass works incorrectly on array");
  equal( !isClass("Hello"), true,"jsface.isClass works incorrectly on string");
  equal( !isClass({ one: 1, two: 2 }), true, "jsface.isClass works incorrectly on map");

  // jsface's Class/Singleton
  var Foo = Class({}),
      Bar = Class({
        constructor: function(){}
      }),
      Util = Class({
        $singleton: true
      });

  equal(isClass(Foo), true, "jsface.isClass works incorrectly on an empty class");
  equal(isClass(Bar), true, "jsface.isClass works incorrectly on a simple class");
  equal( !isClass(Util), true, "jsface.isClass works incorrectly a singleton class (singleton is a map, not a class)");
});

// --------- CLASS --------- //

test("Special syntax", function() {
  var Test = Class();
  equal(isClass(Test), true, "Class defination must be a class");

  var Foo = Class({});
  equal(isClass(Foo), true, "Class defination must be a class");

  var Bar = Class("Hello World", {});
  equal(isClass(Bar), true, "Class defination must be a class");
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

  equal(isFunction(Foo), true, "Class defination must be a function");
  equal(isClass(Foo), true, "Class defination must be a class");
  equal(isMap(foo), true, "Class instance must be a map");
  equal(foo.sayHi(), "Hello World John Rambo", "Error invoking method on class instance");
  equal(foo.name, "John Rambo", "Invalid constructor initialization");
});

test("Class with default constructor", function() {
  var Foo = Class({
        sayBye: function() {
          return "Bye!";
        }
      });

  var foo = new Foo();

  equal(isFunction(Foo), true, "Default constructor must be a function");
  equal(foo.sayBye(), "Bye!", "Error invoking method on class instance");
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

  equal(isFunction(Foo), true, "Default constructor must be a function");
  equal(foo.sayBye(), "Bye!", "Error invoking method on class instance");
  equal(foo.sayHi(), "Hi!", "Invalid private implementation");
  equal( !foo.hi, true, "Invalid private implementation");
  equal( !foo.bye, true, "Invalid private implementation");
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
          Bar.$super.call(this, name);
        },

        sayHi: function() {
          return Bar.$superp.sayHi.call(this);
        },

        sayBye: function() {
          return "Bye!";
        }
      });

  var bar = new Bar("John Rambo");

  equal(bar.name, "John Rambo", "Subclass must be able to invoke parent constructor");
  equal(bar.welcome(), "Welcome John Rambo", "Subclass must be able to inherit parent methods");
  equal(bar.sayHi(), "Hello World John Rambo", "Subclass must be able to invoke parent method");
  equal(bar.sayBye(), "Bye!", "Error invoking subclass method");
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
          Bar.$super.call(this, name);
        },

        sayHi: function() {
          return Bar.$superp.sayHi.call(this);
        }
      });

  var Child = Class(Bar, {
        constructor: function(name) {
          Child.$super.call(this, name);
        },

        sayHi: function() {
          return Child.$superp.sayHi.call(this);
        }
      });

  var child = new Child("John Rambo");

  equal(child.name, "John Rambo", "Subclass must be able to invoke parent constructor");
  equal(child.sayHi(), "Hello John Rambo", "Subclass must be able to invoke parent method");
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

  equal(Bar.sayBye(), "Bye!", "Error invoking static method");
  equal(bar.sayBye(), "Bye!", "Error invoking static method from class instance");
  equal(bar.sayBye, Bar.sayBye, "Static method must be the same on both class and class instance");
});

test("Singleton class", function() {
  var Foo = Class({
        $singleton: true,

        sayHi: function() {
          return "Hello World";
        }
      });

  equal(isMap(Foo), true, "Singleton class must be a map object");
  equal(Foo.sayHi(), "Hello World", "Error invoking method on singleton class");
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

  equal(isMap(Bar), true, "Singleton class must be a map object");
  equal(Bar.sayHi(), "Hello World", "Error invoking method on singleton class");
  equal(Bar.sayBye(), "Bye!", "Error invoking method on singleton class");
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

  equal(isClass(Bar), true, "Class defination must be a class");
  equal(bar.sayHi, Bar.sayHi, "Static method must be the same on both class and class instance");
  equal(bar.sayHi, Foo.sayHi, "Static method must be the same on both class and class instance");
  equal(Foo.sayHi, Bar.sayHi, "Static method must be the same on both class");
  equal(Bar.sayHi(), "Hello World", "Error invoking method on singleton class");
  equal(bar.sayHi(), "Hello World", "Error invoking method on singleton class");
  equal(bar.sayBye(), "Bye!", "Error invoking method on class");
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

  equal(bar.name, "John Rambo", "Invalid extend() behavior, constructor must be bound correctly");
  equal(bar.welcome(), "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
  equal(bar.sayHi(), "Hello World John Rambo", "Invalid extend() behavior");
  equal(bar.sayBye(), "Bye!", "Invalid extend() behavior");
});

test("Mixin: instance extends class", function() {
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

  var bar = new Bar("John Rambo");

  extend(bar, Foo);

  equal(bar.name, "John Rambo", "Invalid extend() behavior, constructor must be bound correctly");
  equal(bar.welcome(), "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
  equal(bar.sayHi(), "Hello World John Rambo", "Invalid extend() behavior");
  equal(bar.sayBye(), "Bye!", "Invalid extend() behavior");
});

test("Mixin: instance extends multiple classes", function() {
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

  var Properties = Class({
        setProperty: function(key, value) {
          this[key] = value;
        },
        getProperty: function(key) {
          return this[key];
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

  var bar = new Bar("John Rambo");

  extend(bar, [ Foo, Properties ]);
  bar.setProperty("fooKey", "fooValue");

  equal(bar.name, "John Rambo", "Invalid extend() behavior, constructor must be bound correctly");
  equal(bar.welcome(), "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
  equal(bar.sayHi(), "Hello World John Rambo", "Invalid extend() behavior");
  equal(bar.sayBye(), "Bye!", "Invalid extend() behavior");
  equal(bar.getProperty("fooKey"), "fooValue", "Invalid extend() behavior");
});


test("Mixin: instance extends class and instance", function() {
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

  var Properties = Class({
        setProperty: function(key, value) {
          this[key] = value;
        },
        getProperty: function(key) {
          return this[key];
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

  var bar = new Bar("John Rambo");

  extend(bar, [ Foo, new Properties() ]);
  bar.setProperty("fooKey", "fooValue");

  equal(bar.name, "John Rambo", "Invalid extend() behavior, constructor must be bound correctly");
  equal(bar.welcome(), "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
  equal(bar.sayHi(), "Hello World John Rambo", "Invalid extend() behavior");
  equal(bar.sayBye(), "Bye!", "Invalid extend() behavior");
  equal(bar.getProperty("fooKey"), "fooValue", "Invalid extend() behavior");
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

  equal(bar.welcome(), "Welcome John Rambo", "Invalid extend() behavior, property must be overriden properly");
  equal(bar.sayHi(), "Hello World John Rambo", "Invalid extend() behavior");
  equal(bar.sayBye(), "Bye!", "Invalid extend() behavior");
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

  equal(Foo.sample, 1, "Invalid extend() behavior, property must be overriden properly");
  equal(Foo.fn(), 2, "Invalid extend() behavior");
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
        }
      });

  extend(Foo, [ Options, Events ]);

  var bar = new Foo("Bar");
  bar.setOptions("nothing");

  equal(bar.name, "Bar", "Invalid extend() behavior, constructor must be bound correctly");
  equal(bar.opts, "nothing", "Invalid extend() behavior, constructor must be bound correctly");
  ok(bar.bind(), "Invalid extend() behavior");
  equal( !bar.unbind(), true, "Invalid extend() behavior");
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
        }
      });

  extend(Foo, [ Options, new Events() ]);

  var foo = new Foo("Bar");
  foo.setOptions("nothing");

  equal(foo.name, "Bar", "Invalid extend() behavior, constructor must be bound correctly");
  equal(foo.opts, "nothing", "Invalid extend() behavior, constructor must be bound correctly");
  equal(Foo.bind(), true, "Invalid extend() behavior");
  equal( !Foo.unbind(), true, "Invalid extend() behavior");
  equal(foo.bind(), true, "Invalid extend() behavior");
  equal( !foo.unbind(), true, "Invalid extend() behavior");
});

test("Mixin: extending native objects", function() {
  extend(String, {
    trim: function() {
      return this.replace(/^\s+|\s+$/g, "");
    }
  });

  equal("    Hello World   ".trim(), "Hello World", "Invalid extend() binding String.prototype");

  extend(Array, {
    sum: function() {
      var s = 0, len = this.length;
      while (len--) {
        s += this[len];
      }
      return s;
    }
  });

  var a = [ 1, 2, 3, 4, 5 ];
  ok(a.sum, "Invalid extend() binding native object");
  ok(Array.sum, "Invalid extend() binding native object");
  ok(Array.prototype.sum, "Invalid extend() binding native object");
  equal(a.sum(), 15, "Invalid extend() binding native object");
});

test("Mixin: extending native objects (prototype only)", function() {
  delete Array.sum;

  extend(Array.prototype, {
    sum: function() {
      var s = 0, len = this.length;
      while (len--) {
        s += this[len];
      }
      return s;
    }
  });

  var a = [ 1, 2, 3, 4, 5 ];

  ok(a.sum, "Invalid extend() binding native object");
  ok( !Array.sum, "Invalid extend() binding native object");
  ok(Array.prototype.sum, "Invalid extend() binding native object");
  equal(a.sum(), 15, "Invalid extend() binding native object");
  delete Array.prototype.sum;
});

test("Test public static void main ;-)", function() {
  var passed;

  var Person = Class({
    constructor: function(name) {
      this.name = name;
    },

    getName: function() {
      passed = true;
      return this.name;
    },

    main: function(Person) {
      // Note that main has access to Person in its arguments only, not the person declared as var outside
      var p = new Person("Rika");
      p.getName();
    }
  });

  ok(passed, "main method must be executed correctly");
  equal(undefined, Person.main, "main must not bound to Person");
  equal(undefined, Person.prototype.main, "main must not bound to Person.prototype");
});

// --------- PLUGINS --------- //

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

  equal(isFunction(Foo.prototype.log), true, "Class plugins mechanism works incorrectly");
  equal(isFunction(foo.log), true, "Class plugins mechanism works incorrectly");
  delete Class.plugins.$log;
});
