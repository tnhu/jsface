jsFace is a framework to facilitate Object Oriented Programming (OOP)
in JavaScript. It is designed to work on both server and client side JavaScript.

## Features

* Focus on facilitating Object Oriented Programming in JavaScript.
* Work on both server and client side JavaScript.
* Plain JavaScript, no dependency.
* Frameworks friendly co-operating by introducing only one namespace to global scope.
* Support method overloading.
* Support parameter type checking and validation.
* Support Aspect Oriented Programming (AOP).
* Support profiling.

## Overview

jsFace introduces only one namespace to public: jsface namespace. This ensures that
jsFace does not have any conflict working with other frameworks. The framework exposes
very basic APIs for accelerating your daily OOP development. It does not cover things
which other frameworks do excellently such as DOM manipulating (like [jQuery](http://jquery.com/)),
template (like [EJS](http://embeddedjs.com/)), etc.

Unlike other frameworks, jsFace does not add any information into JavaScript standard objects
(like Array, Function, Date, Number, String, etc). You can consider jsFace as a JavaScript
prototype helper. It helps you to deal with JavaScript prototype more easily, more elegantly
and precisely. It keeps things as they are respectfully.

## License

jsFace is available under either the terms of the [MIT license](https://github.com/tannhu/jsface/blob/master/MIT-LICENSE.txt)
or the [GPL license version 2](http://www.gnu.org/licenses/gpl-2.0.txt).

## Usage

### Define a class

It's quite easy to define a class. Unlike other frameworks like [MooTools](http://mootools.net/)
or [JS.Class](http://jsclass.jcoglan.com/) where you get your class as a result of a function
call, in jsFace everything happens inside jsface.def.

	jsface.def({
		$meta: {
			name: "Foo"
		},

		/**
		 * Constructor.
		 */
		Foo: function(name) {
			this.name = name;
		},

		sayHi: function() {
			alert("Hello " + this.name);
		}
	});

	var foo = new Foo("Rika");
	foo.sayHi();

jsFace uses $meta as the location for class meta data such as class name, parent class, namespace,
singleton flag, static methods declaration, etc. You will learn more about them later. Everything
other than $meta are class properties or methods.

Practically, you should group your classes in a namespace. I recommend to apply Java layout in which
you put your classes in structured folders. For example, you define a class in Dialog.js:

	jsface.namespace("com.example.ui");

	jsface.def({
		$meta: {
			name: "Dialog",
			namespace: com.example.ui
		}
	}

	var dialog = new com.example.ui.Dialog();

In your hard drive:

	./
	 |-com
	    |-example
	       |-ui
	          Dialog.js

### Define a sub-class

A sub-class is defined by specifying its parent class in $meta.

	jsface.def({
		$meta: {
			name: "Bar",
			parent: Foo
		},

		Bar: function(name) {
			Foo.apply(this, arguments);                   // Invoke parent's constructor
		},

		sayHi: function() {
			Foo.prototype.sayHi.apply(this, arguments);   // Invoke parent's method
		}
	});

### Static methods

Static methods are class level methods which you can invoke from both class or class instances. jsFace
allows you to specify static methods by declaring them in $meta.statics.

	jsface.def({
		$meta: {
			name: "Foo",
			statics: [ 'sayHi' ]
		},

		sayHi: function(name) {
			alert("Hello " + name);
		}
	});

	// Both are valid
	Foo.sayHi("Rika");
	new Foo().sayHi("Rika");

### Define a singleton class

When you want to restrict instantiation of a class to only one object, you need to define a
singleton class. jsFace ensures that there will be no instance of the singleton class instantiated
as runtime. The APIs of the singleton class are exposed from the class itself only.

	jsface.def({
		$meta: {
			name: "Utils",
			singleton: true
		},

		md5: function(msg) {
		}
	});

You can invoke:

	var md5 = Utils.md5(msg);

But got an exception when you try to create an instance:

	var utils = new Utils();  // TypeError: Utils is not a constructor

### Methods overloading

jsFace gives you two ways to overload constructor/method. By parameter length or type.

#### By parameter length

	jsface.def({
		$meta: {
			name: "Foo"
		},

		Foo: [
			function() {               // Default constructor
			},
			function(name) {           // Constructor with one parameter
				this.name = name;
			},
			function(name, age) {      // Constructor with one parameter
				this.name = name;
				this.age = age;
			}
		]
	});

	var foo    = new Foo();
	var rika   = new Foo("Rika");
	var rika24 = new Foo("Rika", 24);

#### By parameter type

	jsface.def({
		$meta: {
			name: "Foo"
		},

		Foo: {
			"String": function(name) {                 // Constructor with one String parameter
				this.name = name;
			},
			"String, Number": function(name, age) {    // Constructor with a String and a Number parameters
				this.name = name;
				this.age = age;
			}
		}
	});

	var rika   = new Foo("Rika");
	var rika24 = new Foo("Rika", 24);

Overloading by parameter type has two cool things:

##### Parameter types will be checked at runtime to match with declaration.

	var rika   = new Foo(1);              // Exception: type not matched, expect String

##### Parameters can be validated.

	jsface.def({
		$meta: {
			name: 'Foo'
		},

		Foo: {
			"String, Number: it > 0": function(name, age) {
				this.name = name;
				this.age = age;
			}
		}
	});

	var rika24 = new Foo("Rika", 0);  // Exception: Validating error at parameter 2

### Pointcuts

jsFace supports [Aspect Oriented Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming)
(AOP) via simple before()/after() mechanism. You can inject before() and after() functions for any class
or class instance created by jsface.def(). Code inside before() and after() are executed in the same context
of the class or class instance that you inject.

Pointcuts can be injected directly when you define a class by jsface.def(). For example:

	var pointcuts = {
		Foo: {
			before: function() {
				this.before = true;
			},
			after: function() {
				this.after = true;
			}
		}
	};

	jsface.def({
		$meta: {
			name: 'Foo',
			pointcuts: pointcuts
		},

		Foo: function() {
		},

		sayHi: function() {
		}
	});

	var foo = new Foo();
	foo.before === true;
	foo.after  === true;

Or after class definition by using jsface.pointcuts():

	jsface.def({
		$meta: {
			name: 'Foo'
		},

		Foo: function() {
		},

		sayHi: function() {
			this.say = true;
		}
	});

	var foo = new Foo();

	// Apply pointcut to sayHi method on foo instance
	jsface.pointcuts(foo, {
		sayHi: {
			before: function() {
				this.before = true;
			},
			after: function() {
				this.after = true;
			}
		}
	});

	foo.sayHi();
	foo.before === true;
	foo.say    === true;
	foo.after  === true;

If you want to skip method executing, return false in before(). For example:

	jsface.pointcuts(foo, {
		sayHi: {
			before: function() {
				this.before = true;
				return false;           // Skip invoking actual sayHi() and after()
			},
			after: function() {
				this.after = true;
			}
		}
	});

	foo.sayHi();
	foo.before === true;
	foo.say    === undefined;
	foo.after  === undefined;

### Plugins

A class can inherit APIs from other classes via $meta.plugins (shortcut of jsface.plugins). A class can
extend from only one parent class but it can inherit multiple classes.

	jsface.def({
		$meta: {
			name: 'Options'
		},

		setOptions: function(attrs){
			jsface.bindProperties(this, attrs);
		}
	});

	jsface.def({
		$meta: {
			name: 'Foo',
			plugins: Options
		},

		Foo: function(opts) {
			this.setOptions(opts);
		}
	});

	var foo = new Foo({ name : "Rika", age: 24 });
	foo.name === "Rika";
	foo.age  === 24;

Multiple plugins:

	jsface.def({
		$meta: {
			name: 'Events'
		},

		bind: function(eventName, fn){
		}
	});

	jsface.def({
		$meta: {
			name: 'Foo',
			plugins: [ Options, Events ]
		},

		Foo: function(opts) {
			this.setOptions(opts);
			this.bind("click", jsface.noop);
		}
	});

### Profiling

jsFace gives you the ability to profile your class/instance via jsface.profiling(). All
you need to do is to give jsface.profiling() a subject and a repository to store the profiling
data. APIs in subject will be monitored.

	jsface.def({
		$meta: {
			name: 'Options'
		},

		setOptions: function(attrs){
			jsface.bindProperties(this, attrs);
		}
	});

	var repository = {};
	jsface.profiling(Options, repository);

	for (var i = 0; i < 1000; i++) {
		new Options().setOptions({});
	}

Finally, you have profiling data in the repository like this:

	repository:
		Options:
			count: 1000
			time:  3
		setOptions:
			count: 1000
			time:  4

Means constructor Options is executed 1000 times in 3ms, setOptions is executed 1000 times
in 4ms.

Please note that jsface.profiling() writes profiling data to the given repository. It does not render
the data for you on browsers.

## Some more thing

Almost all use cases of jsFace are covered in [unit tests](https://github.com/tannhu/jsface/tree/master/test)
(I'm using [QUnit](https://github.com/jquery/qunit)). Take a look on them if you can't find
the thing you need in this short readme.

Question, comments, feedbacks please go to [jsFace Group](http://groups.google.com/group/jsface).