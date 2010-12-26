jsFace JavaScript Object Oriented Programming Framework
=======================================================

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

jsFace introduces only one global namespace to public: jsface namespace. This ensures that
jsFace does not have any conflict working with other frameworks.

## Usage

### Define a class

It's quite easy to define a class. Unlike other frameworks like [MooTools](http://mootools.net/)
or [JS.Class](http://jsclass.jcoglan.com/) where you get your class as a result of a function
call, in jsFace, everything happens inside jsface.def.

	jsface.def({
		$meta: {
			name: "Test"
		},

		/**
		 * Constructor.
		 */
		Test: function(name) {
			this.name = name;
		},

		sayHi: function() {
			alert("Hello " + this.name);
		}
	});

	var test = new Test("Rika");
	test.sayHi();

## License

jsFace is available under either the terms of the MIT license (see MIT-LICENSE.txt)
or the GPL license version 2 (http://www.gnu.org/licenses/gpl-2.0.txt).