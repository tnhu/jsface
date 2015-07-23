var context       = this,
    extend        = jsface.extend,
    mapOrNil      = jsface.mapOrNil,
    arrayOrNil    = jsface.arrayOrNil,
    functionOrNil = jsface.functionOrNil,
    stringOrNil   = jsface.stringOrNil,
    classOrNil    = jsface.classOrNil;

// --------- UTILITIES --------- //

test("Check type with mapOrNil", function() {
  var emptyMap = {},
      fooMap = { one: 1, two: 2 };

  equal(mapOrNil(emptyMap), emptyMap, "jsface.mapOrNil works incorrectly");
  equal(mapOrNil(fooMap), fooMap, "jsface.mapOrNil works incorrectly");

  equal(mapOrNil(), null, "jsface.mapOrNil works incorrectly");
  equal(mapOrNil(""), null, "jsface.mapOrNil works incorrectly");
  equal(mapOrNil("Hello"), null, "jsface.mapOrNil works incorrectly");
  equal(mapOrNil([]), null, "jsface.mapOrNil works incorrectly");
  equal(mapOrNil([ 1, 2, 3 ]), null, "jsface.mapOrNil works incorrectly");
  equal(mapOrNil(1234), null, "jsface.mapOrNil works incorrectly");
});

test("Check type with jsface.mapOrNil on iframe", function() {
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

  equal(mapOrNil(map), map, "jsface.mapOrNil works incorrectly in iframe");
  document.body.removeChild(iframe);
});

test("Check type with jsface.arrayOrNil", function() {
  var emptyArray = [],
      fooArray = [ 1, 2, 3, 4 ];
  equal(arrayOrNil(emptyArray), emptyArray, "jsface.arrayOrNil works incorrectly");
  equal(arrayOrNil(fooArray), fooArray, "jsface.arrayOrNil works incorrectly");
  equal( !arrayOrNil(), true, "jsface.arrayOrNil works incorrectly");

  // jsface.arrayOrNil does not consider String as Array of characters
  equal( !arrayOrNil(""), true, "jsface.arrayOrNil works incorrectly");
  equal( !arrayOrNil("Hello"), true, "jsface.arrayOrNil works incorrectly");
  equal( !arrayOrNil({}), true, "jsface.arrayOrNil works incorrectly");
  equal( !arrayOrNil({ one: 1, two: 2 }), true, "jsface.arrayOrNil works incorrectly");
  equal( !arrayOrNil(1), true, "jsface.arrayOrNil works incorrectly");
});

test("Check type with jsface.arrayOrNil on iframe", function() {
  var frame, iframe, IArray, array;

  iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  frame = window.frames[window.frames.length - 1];
  frame.getArray = function() {
    return Array;
  };

  IArray = frame.getArray();

  array = new IArray(1, 2, 3);

  equal(arrayOrNil(array), array, "jsface.arrayOrNil works incorrectly in iframe");
  document.body.removeChild(iframe);
});

test("Check type with jsface.functionOrNil", function() {
  var fn = function(){};

  equal(functionOrNil(fn), fn, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil([]), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil([ 1, 2, 3, 4 ]), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil(), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil(""), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil("Hello"), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil({}), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil({ one: 1, two: 2 }), null, "jsface.functionOrNil works incorrectly");
  equal(functionOrNil(1), null, "jsface.functionOrNil works incorrectly");
});

test("Check type with jsface.functionOrNil on iframe", function() {
  var frame, iframe, IFunction, fn;

  iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  frame = window.frames[window.frames.length - 1];
  frame.getFunction = function() {
    return Function;
  };

  IFunction = frame.getFunction();

  fn = new IFunction();
  equal(functionOrNil(fn), fn, "jsface.functionOrNil works incorrectly");
  document.body.removeChild(iframe);
});

test("Check type with jsface.classOrNil", function() {
  var fn = function(){};

  equal(classOrNil(fn), fn, "jsface.classOrNil works incorrectly on function");
  equal( !classOrNil(), true, "jsface.classOrNil works incorrectly passing empty param");
  equal( !classOrNil(undefined), true, "jsface.classOrNil works incorrectly undefined");
  equal( !classOrNil(null), true, "jsface.classOrNil works incorrectly on null");
  equal( !classOrNil(""), true, "jsface.classOrNil works incorrectly empty string");
  equal( !classOrNil("   "), true, "jsface.classOrNil works incorrectly blank string");
  equal( !classOrNil({}), true, "jsface.classOrNil works incorrectly empty map");
  equal( !classOrNil([]), true, "jsface.classOrNil works incorrectly empty array");
  equal( !classOrNil(0), true, "jsface.classOrNil works incorrectly on 0");
  equal( !classOrNil(1), true, "jsface.classOrNil works incorrectly on 1");
  equal( !classOrNil(true), true, "jsface.classOrNil works incorrectly on true");
  equal( !classOrNil(false), true, "jsface.classOrNil works incorrectly on false");
  equal( !classOrNil([ 1, 2, 3, 4 ]), true, "jsface.classOrNil works incorrectly on array");
  equal( !classOrNil("Hello"), true,"jsface.classOrNil works incorrectly on string");
  equal( !classOrNil({ one: 1, two: 2 }), true, "jsface.classOrNil works incorrectly on map");

  // jsface's Class/Singleton
  var Foo = Class({}),
      Bar = Class({
        constructor: function(){}
      }),
      Util = Class({
        $singleton: true
      });

  equal(classOrNil(Foo), Foo, "jsface.classOrNil works incorrectly on an empty class");
  equal(classOrNil(Bar), Bar, "jsface.classOrNil works incorrectly on a simple class");
  equal(classOrNil(Util), Util, "jsface.classOrNil works incorrectly a singleton class (singleton is a map, not a class)");
});

// --------- CLASS --------- //

test("Special syntax", function() {
  var Test = Class();
  equal(classOrNil(Test), Test, "Class definition must be a class");

  var Foo = Class({});
  equal(classOrNil(Foo), Foo, "Class definition must be a class");

  var Bar = Class(Object, {});
  equal(classOrNil(Bar), Bar, "Class definition must be a class");
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

  equal(functionOrNil(Foo), Foo, "Class definition must be a function");
  equal(classOrNil(Foo), Foo, "Class definition must be a class");
  equal(mapOrNil(foo), foo, "Class instance must be a map");
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

  equal(functionOrNil(Foo), Foo, "Default constructor must be a function");
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

  equal(functionOrNil(Foo), Foo, "Default constructor must be a function");
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

test("Constants", function() {
  var Bar = Class({
    constructor: function(name) {
      this.name = name;
    },

    $const: {
      CONSTANT: 1,
      OBJECT: {
        C1: "c1",
        C2: "c2",
        C3: {
          C31: "c31"
        }
      }
    }
  });

  var bar = new Bar("Constants");

  equal(Bar.CONSTANT, 1, "Error getting constant");
  equal(Bar.OBJECT.C1, "c1", "Error getting object constant");
  equal(bar.CONSTANT, undefined, "Constant should not be on instance level");
  equal(bar.OBJECT, undefined, "Object constant should not be on instance level");

  Bar.CONSTANT = 2;

  equal(Bar.CONSTANT, 1, "Error, constant value was changed");

  Bar.OBJECT.C3.C31 = "foo";

  equal(Bar.OBJECT.C3.C31, "c31", "Error, object constant value was changed");
});

test("Constants - inheritance", function() {
  var Foo = Class({
    fooField: 100,

    constructor: function(name) {
      this.name = name;
    },

    fooMethod: function() {
      return "fooMethod";
    },

    $const: {
      FOO_CONST: "fooConst",
      OVERRIDDEN_CONST: "originalValue",
      OBJECT_CONST: {
        FIRST: "first",
        SECOND: "second",
        THIRD: {
          THIRD_FIRST: "thirdFirst",
          THIRD_SECOND: "thirdSecond"
        }
      }
    }
  });

  var Bar = Class(Foo, {
    barField: 200,

    constructor: function(name) {
      this.name = name;
    },

    barMethod: function() {
      return "barMethod";
    },

    $const: {
      BAR_CONST: "barConst",
      OVERRIDDEN_CONST: "overriddenValue"
    }
  });

  equal(Foo.FOO_CONST, "fooConst", "Constant is not created properly");
  equal(Bar.FOO_CONST, "fooConst", "Constant is not inherited properly");
  equal(Bar.BAR_CONST, "barConst", "Constant is not created properly");
  equal(Foo.OVERRIDDEN_CONST, "originalValue", "Constant is not created properly");
  equal(Bar.OVERRIDDEN_CONST, "overriddenValue", "Constant is not overridden properly");
  equal(Bar.OBJECT_CONST.FIRST, "first", "Constant is not inherited properly");
  equal(Bar.OBJECT_CONST.THIRD.THIRD_SECOND, "thirdSecond", "Constant is not inherited properly");

  Bar.OBJECT_CONST.THIRD.THIRD_SECOND = "bar";

  equal(Bar.OBJECT_CONST.THIRD.THIRD_SECOND, "thirdSecond", "Error, object constant value was changed");

  var foo = new Foo("Tom");
  var bar = new Bar("John Rambo");

  equal(foo.name, "Tom", "Invalid class creation");
  equal(foo.fooField, 100, "Invalid class creation");
  equal(foo.fooMethod(), "fooMethod", "Invalid class creation");
  equal(foo.FOO_CONST, undefined, "Constant should not be on instance");

  equal(bar.name, "John Rambo", "Invalid class creation");
  equal(bar.fooField, 100, "Invalid class creation");
  equal(bar.barField, 200, "Invalid class creation");
  equal(bar.fooMethod(), "fooMethod", "Invalid class creation");
  equal(bar.barMethod(), "barMethod", "Invalid class creation");
  equal(bar.FOO_CONST, undefined, "Constant should not be on instance");
  equal(bar.BAR_CONST, undefined, "Constant should not be on instance");
  equal(bar.OVERRIDDEN_CONST, undefined, "Constant should not be on instance");
  equal(bar.OBJECT_CONST, undefined, "Constant should not be on instance");
});

test("Static methods", function() {
  var Bar = Class({
        constructor: function(name) {
          this.name = name;
        },

        $static: {
          sayBye: function() {
           return "Bye!";
          }
        }
      });

  var bar = new Bar("John Rambo");

  equal(Bar.sayBye(), "Bye!", "Error invoking static method");
  equal(bar.sayBye, undefined, "Static method should not be on instance level");
});

test("Static methods should be inherited accordingly", function() {
  var Foo = Class({
    fooField: 100,

    constructor: function(name) {
      this.name = name;
    },

    fooMethod: function() {
      return "fooMethod";
    },

    $static: {
      fooStaticMethod: function() {
       return "fooStaticMethod";
      }
    }
  });

  var Bar = Class(Foo, {
    barField: 200,

    constructor: function(name) {
      this.name = name;
    },

    barMethod: function() {
      return "barMethod";
    },

    $static: {
      barStaticMethod: function() {
       return "barStaticMethod";
      }
    }
  });

  equal(Foo.fooStaticMethod(), "fooStaticMethod", "Static method is not created properly");
  equal(Bar.fooStaticMethod(), "fooStaticMethod", "Static method is not inherited properly");
  equal(Bar.barStaticMethod(), "barStaticMethod", "Static method is not created properly");

  var foo = new Foo("Tom");
      bar = new Bar("John Rambo");

  equal(foo.name, "Tom", "Invalid class creation");
  equal(foo.fooField, 100, "Invalid class creation");
  equal(foo.fooMethod(), "fooMethod", "Invalid class creation");
  equal(foo.fooStaticMethod, undefined, "Static method should not be on instance");

  equal(bar.name, "John Rambo", "Invalid class creation");
  equal(bar.fooField, 100, "Invalid class creation");
  equal(bar.barField, 200, "Invalid class creation");
  equal(bar.fooMethod(), "fooMethod", "Invalid class creation");
  equal(bar.barMethod(), "barMethod", "Invalid class creation");
  equal(bar.fooStaticMethod, undefined, "Static method should not be on instance");
  equal(bar.barStaticMethod, undefined, "Static method should not be on instance");
});

test("Properties - getters and setters", function() {
  var Person = Class({
    constructor : function(name) {
      this._name = name;
    },
    name : {
      get : function() {
        return this._name;
      },
      set : function(value) {
        this._name = value;
      }
    }
  });

  var person = new Person("Milos");

  equal(person.name, "Milos", "Invalid property getter");

  person.name = "Boki";

  equal(person.name, "Boki", "Invalid property setter");
});

test("Properties - skip getters and setters", function() {
  var Person = Class({
    name: undefined,

    setName: function(name) {
      this.name = name;
    }
  });

  var person = new Person();

  equal(person.name, undefined, "Invalid property getter");

  person.setName("Boki");

  equal(person.name, "Boki", "Invalid property setter");
});

test("Properties - getters and setters - inheritance", function() {
  var Person = Class({
    constructor: function(name) {
      this._name = name;
    },
    name: {
      get: function() {
        return this._name;
      },
      set: function(value) {
        this._name = value;
      }
    }
  });

  var Student = Class(Person, {
    constructor: function(name, age) {
      Student.$super.call(this, name);
      this._age = age;
    },
    age: {
      get: function() {
        return this._age;
      },
      set: function(value) {
        this._age = value;
      }
    }
  });

  var student = new Student("Mia", 18);

  equal(student.name, "Mia", "Bad property inheritance");

  student.name = "Persa";

  equal(student.name, "Persa", "Bad property inheritance");
  equal(student.age, 18, "Invalid property getter");
});

test("Properties - getters and setters - inheritance and mixins", function() {
  var Person = Class({
    constructor: function(name) {
      this._name = name;
    },
    name: {
      get: function() {
        return this._name;
      },
      set: function(value) {
        this._name = value;
      }
    }
  });

  var Options = Class({
    option: {
      get: function() {
        return this._option;
      },
      set: function(value) {
        this._option = value;
      }
    }
  });

  var Student = Class([Person, Options], {
    constructor: function(name, age) {
      Student.$super.call(this, name);
      this._age = age;
    },
    age: {
      get: function() {
        return this._age;
      },
      set: function(value) {
        this._age = value;
      }
    }
  });

  var student = new Student("Mia", 18);
  student.option = 'some option';

  equal(student.option, 'some option', 'Getter/setter does not work properly with mixin');
});

test("Singleton class", function() {
  var Foo = Class({
        $singleton: true,

        sayHi: function() {
          return "Hello World";
        }
      });

  equal(classOrNil(Foo), Foo, "Singleton class must be a a class");
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

  equal(classOrNil(Bar), Bar, "Singleton class must be a a class");
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

  equal(classOrNil(Bar), Bar, "Class definition must be a class");
  equal(bar.sayHi, undefined, "Static method from parent class should not be available on child instance");
  equal(Foo.sayHi(), "Hello World", "Error invoking method on singleton class");
  equal(Bar.sayHi(), "Hello World", "Static method should be available on child class");
  equal(Foo.sayHi, Bar.sayHi, "Static method must be the same on both class");
  equal(bar.sayBye(), "Bye!", "Error invoking method on class");
});

test("Override singleton method", function() {
  var Foo = Class({
    $singleton: true,

    hi: function() {
      return "hi";
    },

    bye: function() {
      return "bye";
    }
  });

  var Bar = Class(Foo, {
    $singleton: true,

    // override hi
    hi: function() {
      return "override-hi";
    }
  });

  equal(Foo.hi(), "hi", "Error invoking method on singleton class");
  equal(Foo.bye(), "bye", "Static method should be available on child class");
  equal(Bar.hi(), "override-hi", "Error invoking method on singleton class");
  equal(Foo.bye(), "bye", "Static method should be available on child class");
});

test("Override singleton method and call parent method", function() {
  var Foo = Class({
    $singleton: true,

    hi: function() {
      return "hi";
    },

    bye: function() {
      return "bye";
    }
  });

  var Bar = Class(Foo, {
    $singleton: true,

    // override hi
    hi: function() {
      return "override-" + Bar.$super.hi.call(this);
    }
  });

  equal(Foo.hi(), "hi", "Error invoking method on singleton class");
  equal(Foo.bye(), "bye", "Static method should be available on child class");
  equal(Bar.hi(), "override-hi", "Error invoking method on singleton class");
  equal(Foo.bye(), "bye", "Static method should be available on child class");
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

  ok(functionOrNil(Bar.welcome), "Static method is not copied when extending");
  ok(functionOrNil(Bar.sayHi), "Static method is not copied when extending");

  equal(bar.welcome(), "invalid", "Invalid extend() behavior, property must be overriden properly");
  equal(bar.sayBye(), "Bye!", "Invalid extend() behavior");
  equal(bar.sayHi, undefined, "Invalid extend() behavior");
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
        $static: {
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
        _bind: function(event, fn) {
          return true;
        },
        _unbind: function(event, fn) {
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
  equal(Foo._bind(), true, "Invalid extend() behavior");
  equal( !Foo._unbind(), true, "Invalid extend() behavior");
  equal(foo._bind, undefined, "Static method can't be copied to instance");
  equal(foo._unbind, undefined, "Static method can't be copied to instance");
});

test("Mixin: extending native objects", function() {
  extend(String, {
    myTrim: function() {
      return this.replace(/^\s+|\s+$/g, "");
    }
  });

  ok(String.myTrim, "Extend does not work properly");
  equal(String.prototype.myTrim, undefined, "Extend does not work properly");
  equal(String.myTrim.apply("    Hello World   "), "Hello World", "Invalid extend() binding String.prototype");

  delete String.myTrim;

  extend(String.prototype, {
    myTrim: function() {
      return this.replace(/^\s+|\s+$/g, "");
    }
  });

  ok(String.prototype.myTrim, "Extend does not work properly");
  equal(String.myTrim, undefined, "Extend does not work properly");
  equal("    Hello World   ".myTrim(), "Hello World", "Invalid extend() binding String.prototype");
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


test("Test instanceof", function() {
  var Person = Class({
    constructor: function(name) {
      this.name = name;
    }
  });

  var Student = Class(Person, {
    constructor: function(id, name) {
      this.id = id;
      Person.call(this, name);
    }
  });

  var p = new Person("Tom"),
      s = new Student(1, "Mary");

  ok(p instanceof Person, "class fails to test instanceof");
  ok(s instanceof Person, "class fails to test instanceof");
  ok(s instanceof Student, "class fails to test instanceof");
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

  equal(functionOrNil(Foo.prototype.log), Foo.prototype.log, "Class plugins mechanism works incorrectly");
  equal(functionOrNil(foo.log), foo.log, "Class plugins mechanism works incorrectly");
  delete Class.plugins.$log;
});

test("$ready plugin: class notifies itself", function() {
  var notified = false;

  var Foo = Class({
    $ready: function(clazz, parent, api) {
      notified = true;
      equal(this, clazz, "clazz must be equal to this");
      ok(functionOrNil(api.$ready), "$ready works incorrectly");
      ok(functionOrNil(api.echo), "$ready works incorrectly");
      ok(functionOrNil(clazz.prototype.echo), "$ready works incorrectly");
      ok( !parent, "$ready works incorrectly");
    },
    echo: function(o) {
      return o;
    }
  });

  ok(notified, "$ready must be executed");
});

test("$ready plugin: class is notified when its subclasses are ready", function() {
  var notified = false;

  var Foo = Class({
    $ready: function(clazz, parent, api) {
      notified = true;

      if (this !== clazz) {
        ok(api.echo2, "$ready works incorrectly");
        ok( !api.$ready, "$ready works incorrectly");
        ok(functionOrNil(clazz.prototype.echo2), "$ready works incorrectly");
      }
    },
    echo: function(o) {
      return o;
    }
  });

  ok(notified, "$ready must be executed when class is created");

  var Bar = Class(Foo, {
    echo2: function(o) {
      return o;
    }
  });
});

test("$ready plugin: class is notified when its subclasses are ready (multiple levels)", function() {
  var count = 0;

  var Foo = Class({
    $ready: function(clazz, parent, api) {
      if (this !== clazz) {
        count++;
      }
    }
  });

  var Bar1 = Class(Foo, {});
  var Bar2 = Class(Bar1, {});
  var Bar3 = Class(Bar2, {});

  ok(count === 3, "$ready must be executed in multiple level inheritance");
});
