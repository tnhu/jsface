jsFace is another framework to facilitate Object Oriented Programming (OOP)
in JavaScript. It is designed to work on both server and client side JavaScript.

jsFace has some cool features like method overloading, type checking, Aspect
Oriented Programming (AOP), and profiling. It came out when I developed an ExtJS-liked
UI framework using jQuery. The combination of jsFace and jQuery results a solid
foundation to build reusable UI components.

Get started
-----------

This is a work-in-progress Get started. For actual use cases, please take a look on jsFace unit tests.

#### Basic

Let define a simple class with one constructor and one method

	jsface.def({
		$meta: {
	    	name: 'Person'
		},

		Person: function(name){
			this.name = name;
		},

		getName: function(){
			return this.name;
		}
	});

	var person = new Person('John F. Kennedy');
	person.getName(); // 'John F. Kennedy'

#### A singleton class

	jsface.def({
		$meta: {
	    	name: 'Utils',
	    	singleton: true
		},

		echo: function(msg){
			alert(msg);
		}
	});

	Utils.echo('Hello World');

#### Define a sub-class

	jsface.def({
		$meta: {
	    	name: 'Student',
	    	parent: Person
		},

		Student: function(name){
			Person.apply(this, arguments);
		}
	});

	var student = new Student('John F. Kennedy');
	student.getName(); // 'John F. Kennedy'

#### Method overloading.

jsFace supports two ways to declare overloading: by Array (wrap by []) or by Map (wrap by {}).
Overloading by Array is just about parameters length. Overloading by Map supports parameter and type checking.

	jsface.def({
		$meta: {
	    	name: 'Person'
		},

		Person: [
			function(name) {
				this.name = name;
			},
			function(name, age) {
				this.name = name;
				this.age = age;
			},
			function(name, age, address) {
				this.name = name;
				this.age = age;
				this.address = address;
			}
		]
	});

#### Type checking and parameter validating

You can specify the condition of parameters passing in to a method by expression. Any valid JavaScript
expression can be used. Note that *it* is the actual value which is passed to the method.

	jsface.def({
		$meta: {
	    	name: 'Person'
		},

		Person: {
			'String, Number: it > 0': function(name, age) {
				this.name = name;
				this.age = age;
			},
			'String, Number: it > 0, Number: it > 0': function(name, age, gpa) {
				this.name = name;
				this.age = age;
			}
		},

		setGPA: {
			'Number: it > 0': function(gpa) {
				this.gpa = gpa;
			}
		}
	});

#### Aspect Oriented Programming

jsFace has built-in support for AOP via simple before and after mechanic. You can inject before and after functions
for any class or class instance. Code inside before and after are executed with the same context of the class or
class instance that you inject.

	jsface.def({
		$meta: {
			name: 'Foo'
		},

		Foo: function() {
			this.count++;
		},

		sayHi: function() {
			this.say++;
		}
	});

	jsface.pointcuts(Foo, {
		Foo: {
			before: function() {
				this.count = 1;
			},
			after: function() {
				this.count++;
			}
		},

		sayHi: {
			before: function() {
				this.say = 1;
			},
			after: function() {
				this.say++;
			}
		}
	});

Community
---------

    Website ........ https://github.com/tannhu/jsface
    Mailing List ... to be defined
    Wiki ........... to be defined
    Twitter ........ to be defined
    Issues ......... to be defined

License
-------

jsFace is available under either the terms of the MIT license or the GPL
license version 2 (http://www.gnu.org/licenses/gpl-2.0.txt).

The text of the MIT is reproduced below.

### MIT License

Copyright (c) 2010 Tan Nhu

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
