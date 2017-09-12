![Benchmark result](https://lh5.googleusercontent.com/-2dQo8ttjn48/T2KVyppgd2I/AAAAAAAADQw/GvEpE5MIYUo/s956/Screen%2520Shot%25202012-03-15%2520at%25206.21.04%2520PM.png "Benchmark")

[![Build Status](https://secure.travis-ci.org/tannhu/jsface.svg?branch=master)](http://travis-ci.org/tannhu/jsface)

## Features

* Small footprint, no dependency, 0.7K minimized+gzip!
* Super fast! See [benchmark](http://jsperf.com/oop-benchmark/6).
* Work on both server and client side.
* Support CommonJS.
* Support getter/setter, constant, main, singleton, mixin, private properties, Aspect Oriented Programming.
* Plugins mechanism to extend itself.

## Setup

JSFace supports both server side (CommonJS) and client side JavaScript (browser).

### Browser

#### bower

``` sh
bower install jsface
```

``` html
<script src="bower_components/jsface/jsface.js"></script>
```

#### dnsjs

``` javascript
<script src="https://cdn.jsdelivr.net/npm/jsface@2.4.9/dist/jsface.min.js"></script>
```

#### Manually

``` html
<script src="jsface.js"></script>
```

### NodeJS environment

First install JSFace via npm:

``` sh
npm install jsface
```

Then use its APIs, for example:

``` javascript
var jsface = require("jsface"),
    Class  = jsface.Class,
    extend = jsface.extend;
```

## Usage

### Define a class

``` javascript
var Person = Class({
  constructor: function(name, age) {
    this.name = name;
    this.age  = age;
  },

  // Getter/Setter
  address: {
    get: function() {
      return this._address;
    },
    set: function(value) {
      this._address = value;
    }
  },

  toString: function() {
    return this.name + "/" + this.age;
  }
});

var person = new Person("Rika", 20);
person.toString();                               // "Rika/20"
```

### Define a sub-class

``` javascript
var Student = Class(Person, {
  constructor: function(id, name, age) {
    this.id = id;
    Student.$super.call(this, name, age);        // Call parent's constructor
  },

  toString: function() {
    return this.id + "/" + Student.$superp.toString.call(this); // Call parent's toString method
  }
});

var student = new Student(1, "Rika", 20);
student.toString();                              // "1/Rika/20"
```

### main

JSFace supports a special method named main(). main() is executed right after the class is created.

``` javascript
Class({
  constructor: function(name) {
    this.name = name;
  },

  getName: function() {
    return this.name;
  },

  main: function(Person) {                       // Class is passed to main() as its first argument
    var p = new Person("Rika");

    p.getName();                                 // "Rika"
  }
});
```

### Singleton class

``` javascript
var Util = Class({
  $singleton: true,

  echo: function(obj) {
    return obj;
  }
});

Util.echo(2012);                                 // 2012
```

### Static properties

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

Person.MIN_AGE === 1;                            // true
Person.MAX_AGE === 150;                          // true
Person.isValidAge(0);                            // false
```

### Constants

Constants work the same as static properties. The only different is they are immutable.

``` javascript
var Person = Class({
  $const: {
    MIN_AGE: 1,
    MAX_AGE: 150
  },

  constructor: function(name, age) {
    this.name = name;
    this.age  = age;
  }
});

Person.MIN_AGE = -1;
Person.MIN_AGE === 1;                            // true, MIN_AGE is immutable
```


### Private properties

JSFace supports private static properties, meaning the properties are shared over instances.

``` javascript
var Person = Class(function() {
  var MIN_AGE =   1,                             // private variables
      MAX_AGE = 150;

  function isValidAge(age) {                     // private method
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

### Mixins

JSFace provides a powerful mechanism to support mixins. Reusable code can be mixed into almost anything.

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
student.setOptions({ foo: true });               // student.opts === { foo: true }
student.bind();                                  // true
student.unbind();                                // false
```

Or after defining classes:

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
extend(String.prototype, {
  trim: function() {
    return this.replace(/^\s+|\s+$/g, "");
  }
});

"   Hello World    ".trim();                     // "Hello World"
```
### No conflict

In browser environment, you might be using another library which also introduces the global namespace Class. JSFace can return the original Class back to the library claims it with a call to jsface.noConflict().

``` javascript
jsface.noConflict();

// Code that uses other library's Class can follow here
// ...

// Define classes by using jsface.Class directly
var Person = jsface.Class({
});
```

## Plugins

### Plug and Play pointcut

JSFace supports Aspect Oriented Programming (AOP) via simple before/after mechanism. You can apply pointcuts over class constructors, class methods, singleton methods, instance methods. You can even apply pointcuts over native classes.

AOP support is implemented as a standalone plugin.

#### Setup

Browser:

``` html
<script src="jsface.pointcut.js"></script>
```

then in your code, make an alias to jsface.pointcut:

``` javascript
var pointcut = jsface.pointcut;
```

NodeJS:

``` javascript
var pointcut = require("jsface.pointcut");
```

#### Applying pointcuts

In JSFace, an advisor is a set of pointcuts you want to apply to a subject. You can apply as many advisors as you want.

``` javascript
Person = Class({
  constructor: function(name) {
    this.name    = name;
    this.counter = 0;
  },
  foo: function(n) {
  },
  bar: function(n) {
  }
});

var advisor = {
  constructor: {
    before: function() {
      this.age = 20;
    },
    after: function() {
      this.email = "rika@sample.com";
    }
  },
  foo: function(n) {                             // sugar syntax, foo:before
    this.counter++;
  },
  bar: {
    before: function(n) {
      this.counter++;
    },
    after: function(n) {
      this.counter++;
    }
  }
};

Person = pointcut(Person, advisor);

var person = new Person("Rika");

person.foo();
person.bar();

person.name    === "Rika";                       // true
person.age     === 20;                           // true
person.email   === "rika@sample.com";            // true
person.counter === 3;                            // true
```

#### Removing pointcuts

Using previous apply pointcut example:

``` javascript
// remove all pointcuts bound to constructor and foo
Person = poincut(Person, "remove constructor foo");

// remove advisor, other advisors remained
Person = poincut(Person, "remove", advisor);

// remove all advisors, restore the fresh version of Person
Person = poincut(Person, "remove");
```

### $ready

$ready plugin is designed to help a parent class to intercept their subclasses' creation.

#### Sample

``` javascript
var Service = Class({
  $ready: function(clazz, parent, api) {
    var type = (this !== clazz) && api.type;     // (this !== clazz) means this comes from a sub-class

    switch (type) {
      case "session":
        // do something with subclass clazz when its type is session
        break;
      case "application":
        // do something with subclass clazz when its type is application
        break;
    }
  }
});

var SessionService = Class(Service, {
  type: "session"
});

var ApplicationService = Class(Service, {
  type: "application"
});
```

## Bug tracker

Have a bug? Please [create an issue here](https://github.com/tannhu/jsface/issues) on GitHub!

## License

Copyright (c) Tan Nhu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
