module('Class Tests');

test('jsface.def with invalid params', function() {
	raises(function() {
		jsface.def(null);
	}, 'An exception must be thrown for invalid params');
});

test('jsface.def with invalid params.$meta', function() {
	raises(function() {
		jsface.def({});
	}, 'An exception must be thrown for invalid params.$meta');
});

test('jsface.def with invalid params.$meta.name', function() {
	raises(function() {
		jsface.def({
			$meta: {
				name: 'Hello World'
			}
		});
	}, 'An exception must be thrown for invalid params.$meta.name');
});

test('Define a class without any API - default contructor will be generated', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		}
	});

	var foo = new jsface.tests.Foo();

	ok(jsface.isClass(jsface.tests.Foo), 'Class defination must be a class');
	ok(jsface.isMap(foo), 'Class instance must be a map');
	delete jsface.tests;
});

test('Define a class with only constructor', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: function(msg) {
			this.msg = msg;
		}
	});

	var foo = new jsface.tests.Foo('Hi');

	ok(jsface.isClass(jsface.tests.Foo), 'Class defination must be a class');
	ok(jsface.isMap(foo), 'Class instance must be a map');
	equals(foo.msg, 'Hi', 'Constructor works incorrectly');
	delete jsface.tests;
});

test('Define a class', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: function(name) {
			this.name = name;
		},

		sayHi: function() {
			return 'Hello World ' + this.name;
		}
	});

	var foo = new jsface.tests.Foo('John Rambo');

	ok(jsface.isFunction(jsface.tests.Foo), 'Class defination must be a function');
	ok(jsface.isMap(foo), 'Class instance must be a map');
	ok(foo.sayHi() === 'Hello World John Rambo', 'Error invoking method on class instance');
	delete jsface.tests;
});

test('Define a class with default constructor', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		sayBye: function() {
			return 'Bye!';
		}
	});

	var foo = new jsface.tests.Foo();

	ok(jsface.isFunction(jsface.tests.Foo), 'Default constructor must be a function');
	ok(foo.sayBye() === 'Bye!', 'Error invoking method on class instance');
	delete jsface.tests;
});

test('Define a sub class', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: function(name) {
			this.name = name;
		},

		welcome: function() {
			return 'Welcome ' + this.name;
		},

		sayHi: function() {
			return 'Hello World ' + this.name;
		}
	});

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests,
			parent: jsface.tests.Foo
		},

		Bar: function(name) {
			jsface.tests.Foo.apply(this, arguments);
		},

		sayHi: function() {
			return jsface.tests.Foo.prototype.sayHi.apply(this, arguments);
		},

		sayBye: function() {
			return 'Bye!';
		}
	});

	var bar = new jsface.tests.Bar('John Rambo');

	ok(bar.name === 'John Rambo', 'Subclass must be able to invoke parent constructor');
	ok(bar.welcome() === 'Welcome John Rambo', 'Subclass must be able to inherit parent methods');
	ok(bar.sayHi() === 'Hello World John Rambo', 'Subclass must be able to invoke parent method');
	ok(bar.sayBye() === 'Bye!', 'Error invoking subclass method');
	delete jsface.tests;
});

test('Static methods', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests,
			statics: ['sayBye']
		},

		Bar: function(name) {
			this.name = name;
		},

		sayBye: function() {
			return 'Bye!';
		}
	});

	var bar = new jsface.tests.Bar('John Rambo');

	ok(jsface.tests.Bar.sayBye() === 'Bye!', 'Error invoking static method');
	ok(bar.sayBye() === 'Bye!', 'Error invoking static method from class instance');
	ok(bar.sayBye === jsface.tests.Bar.sayBye, 'Static method must be the same on both class and class instance');
	delete jsface.tests;
});

test('Define a singleton class', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests,
			singleton: true
		},

		sayHi: function() {
			return 'Hello World';
		}
	});

	var Foo = jsface.tests.Foo;

	ok(jsface.isMap(Foo), 'Singleton class must be a map object');
	ok(Foo.sayHi() === 'Hello World', 'Error invoking method on singleton class');
	delete jsface.tests;
});

test('Inherit a singleton class', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests,
			singleton: true
		},

		sayHi: function() {
			return 'Hello World';
		}
	});

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests,
			parent: jsface.tests.Foo,
			singleton: true
		},

		sayBye: function() {
			return 'Bye!';
		}
	});

	var Bar = jsface.tests.Bar;

	ok(jsface.isMap(Bar), 'Singleton class must be a map object');
	ok(Bar.sayHi() === 'Hello World', 'Error invoking method on singleton class');
	ok(Bar.sayBye() === 'Bye!', 'Error invoking method on singleton class');
	delete jsface.tests;
});


test('Inheritance: anonymous API', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		}
	});

	var api = {
		setName: function(name){
			this.name = name;
		}
	};

	jsface.inherit(jsface.tests.Foo, api);

	var foo = new jsface.tests.Foo();
	foo.setName('John');

	ok(foo.name === 'John', 'APIs must be plugged into class');
	ok(foo.setName === api.setName, 'APIs must be plugged into class');
	ok(jsface.tests.Foo.prototype.setName === api.setName, 'APIs must be plugged into class');
	delete jsface.tests;
});

test('Inheritance: instance inherits from anonymous api', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		}
	});

	var api = {
		setName: function(name){
			this.name = name;
		}
	};

	var foo = new jsface.tests.Foo();

	jsface.inherit(foo, api);

	foo.setName('John');

	ok(foo.name === 'John', 'APIs must be plugged into class instance');
	ok(foo.setName === api.setName, 'APIs must be plugged into class instance');
	ok( !jsface.tests.Foo.prototype.setName, 'APIs must be plugged into class instance and not class');
	delete jsface.tests;
});

test('Inheritance: class to class', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		}
	});

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests
		},

		setName: function(name){
			this.name = name;
		}
	});

	jsface.inherit(jsface.tests.Foo, jsface.tests.Bar);

	var foo = new jsface.tests.Foo();
	foo.setName('John');

	ok(foo.name === 'John', 'APIs must be plugged into class');
	ok(foo.setName === jsface.tests.Bar.prototype.setName, 'APIs must be plugged into class');
	ok(jsface.tests.Foo.prototype.setName === jsface.tests.Bar.prototype.setName, 'APIs must be plugged into class');
	delete jsface.tests;
});

test('Inheritance: class to instance', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		}
	});

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests
		},

		setName: function(name){
			this.name = name;
		}
	});

	var foo = new jsface.tests.Foo();
	jsface.inherit(foo, jsface.tests.Bar);
	foo.setName('John');

	ok(foo.name === 'John', 'APIs must be plugged into class instance');
	ok(foo.setName === jsface.tests.Bar.prototype.setName, 'APIs must be plugged into class instance');
	ok( !jsface.tests.Foo.prototype.setName, 'APIs must be plugged into class instance and not the class');
	delete jsface.tests;
});

test('Inheritance: multiplicity', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		}
	});

	jsface.def({
		$meta: {
			name: 'Events',
			namespace: jsface.tests
		},

		bind: function(name){
			this.event = name;
		}
	});

	jsface.def({
		$meta: {
			name: 'Options',
			namespace: jsface.tests
		},

		setOptions: function(attrs){
			jsface.bindProperties(this, attrs);
		}
	});

	jsface.inherit(jsface.tests.Foo, [ jsface.tests.Events, jsface.tests.Options ]);

	var foo = new jsface.tests.Foo();

	foo.bind('click');
	foo.setOptions({ name: 'John', age: 58 });

	ok(foo.event === 'click', 'APIs must be plugged into class');
	ok(foo.name === 'John', 'APIs must be plugged into class');
	ok(foo.age === 58, 'APIs must be plugged into class');
	ok(foo.bind === jsface.tests.Events.prototype.bind, 'APIs must be plugged into class');
	ok(foo.setOptions === jsface.tests.Options.prototype.setOptions, 'APIs must be plugged into class');
	ok(jsface.tests.Foo.prototype.bind === jsface.tests.Events.prototype.bind, 'APIs must be plugged into class');
	ok(jsface.tests.Foo.prototype.setOptions === jsface.tests.Options.prototype.setOptions, 'APIs must be plugged into class');
	delete jsface.tests;
});

test('Inheritance: via $meta.parent', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests
		},

		setName: function(name){
			this.name = name;
		}
	});

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests,
			parent: jsface.tests.Bar
		}
	});

	var foo = new jsface.tests.Foo();
	foo.setName('John');

	ok(foo.name === 'John', 'APIs must be plugged into class');
	ok(foo.setName === jsface.tests.Bar.prototype.setName, 'APIs must be plugged into class');
	ok(jsface.tests.Foo.prototype.setName === jsface.tests.Bar.prototype.setName, 'APIs must be plugged into class');
	delete jsface.tests;
});

test('Inheritance: multiplicity via $meta.parent', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Events',
			namespace: jsface.tests
		},

		bind: function(name){
			this.event = name;
		}
	});

	jsface.def({
		$meta: {
			name: 'Options',
			namespace: jsface.tests
		},

		setOptions: function(attrs){
			jsface.bindProperties(this, attrs);
		}
	});

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests,
			parent: [ jsface.tests.Events, jsface.tests.Options ]
		}
	});

	var foo = new jsface.tests.Foo();

	foo.bind('click');
	foo.setOptions({ name: 'John', age: 58 });

	equals(foo.event, 'click', 'APIs must be plugged into class');
	equals(foo.name, 'John', 'APIs must be plugged into class');
	equals(foo.age, 58, 'APIs must be plugged into class');
	equals(foo.bind, jsface.tests.Events.prototype.bind, 'APIs must be plugged into class');
	equals(foo.setOptions, jsface.tests.Options.prototype.setOptions, 'APIs must be plugged into class');
	equals(jsface.tests.Foo.prototype.bind, jsface.tests.Events.prototype.bind, 'APIs must be plugged into class');
	equals(jsface.tests.Foo.prototype.setOptions, jsface.tests.Options.prototype.setOptions, 'APIs must be plugged into class');
	delete jsface.tests;
});

test('Class level initialization', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests,
			ready: function(clazz, opts) {
				ok(jsface.isFunction(jsface.tests.Bar), 'Class defination must be defined before class initialization');
				ok(clazz.$meta.name === 'Bar', 'Invalid class name');
				ok(opts.$meta.name === 'Bar', 'Invalid opts.$meta.name');
			},
		},

		Bar: function(name) {
			this.name = name;
		}
	});
	delete jsface.tests;
});

test('Sub classes method call chain', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: function(name) {
			this.name = name;
		},

		sayHi: function() {
			return 'Hello ' + this.name;
		}
	});

	jsface.def({
		$meta: {
			name: 'Bar',
			namespace: jsface.tests,
			parent: jsface.tests.Foo
		},

		Bar: function(name) {
			jsface.tests.Foo.apply(this, arguments);
		},

		sayHi: function() {
			return jsface.tests.Foo.prototype.sayHi.apply(this, arguments);
		}
	});

	jsface.def({
		$meta: {
			name: 'Child',
			namespace: jsface.tests,
			parent: jsface.tests.Bar
		},

		Child: function(name) {
			jsface.tests.Bar.apply(this, arguments);
		},

		sayHi: function() {
			return jsface.tests.Bar.prototype.sayHi.apply(this, arguments);
		}
	});

	var child = new jsface.tests.Child('John Rambo');

	ok(child.name === 'John Rambo', 'Subclass must be able to invoke parent constructor');
	ok(child.sayHi() === 'Hello John Rambo', 'Subclass must be able to invoke parent method');
	delete jsface.tests;
});

test('Constructor overloading (Array)', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: [
			function(name) {
				this.name = name;
			},
			function(name, age) {
				this.name = name;
				this.age = age;
			}
		]
	});

	var foo1 = new jsface.tests.Foo('John Rambo'),
		foo2 = new jsface.tests.Foo('John Rambo', 55);

	ok(foo1.name === 'John Rambo', 'Invalid constructor overloading');
	ok(!foo1.age, 'Invalid constructor overloading');
	ok(foo2.name === 'John Rambo', 'Invalid constructor overloading');
	ok(foo2.age == 55, 'Invalid constructor overloading');
	delete jsface.tests;
});

test('Constructor overloading (Array) - default constructor', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: [
			// Default constructor
			function() {
				jsface.bindProperties(this, {
					name: 'John Rambo',
					age: 55
				});
			},
			function(name) {
				this.name = name;
			},
			function(name, age) {
				this.name = name;
				this.age = age;
			}
		]
	});

	var foo = new jsface.tests.Foo();

	ok(foo.name === 'John Rambo', 'Invalid constructor overloading');
	ok(foo.age == 55, 'Invalid constructor overloading');

	var foo2 = new jsface.tests.Foo(1, 2, 3);

	ok(foo2.name === 'John Rambo', 'Invalid constructor overloading');
	ok(foo2.age == 55, 'Invalid constructor overloading');
	delete jsface.tests;
});

test('Method overloading (Array)', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		count: [
			function() {
				return 0;
			},
			function(num) {
				return num;
			},
			function(num1, num2) {
				return num1 + num2;
			}
		]
	});

	var foo = new jsface.tests.Foo();

	ok(foo.count() === 0, 'Default overloading must get called');
	ok(foo.count(1, 2, 3) === 0, 'Default overloading must get called');
	ok(foo.count(1) == 1, 'Second overloading must get called');
	ok(foo.count(1, 2) == 3, 'Third overloading must get called');
	delete jsface.tests;
});

test('Constructor overloading (Map)', function() {
	jsface.namespace('jsface.tests');
	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: {
			'String': function(name) {
				this.name = name;
			},
			'String, Number': function(name, age) {
				this.name = name;
				this.age = age;
			}
		}
	});

	var foo1 = new jsface.tests.Foo('John Rambo'),
		foo2 = new jsface.tests.Foo('John Rambo', 55);

	ok(foo1.name === 'John Rambo', 'First constructor must get called');
	ok(!foo1.age, 'First constructor must get called');
	ok(foo2.name === 'John Rambo', 'Second constructor must get called');
	ok(foo2.age == 55, 'Second constructor must get called');
	delete jsface.tests;
});

test('Pointcuts over constructor and method', function() {
	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests
		},

		Foo: function() {
			this.count++;
		},

		sayHi: function() {
			this.say++;
		}
	});

	jsface.pointcuts(jsface.tests.Foo, {
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

	var foo = new jsface.tests.Foo();
	foo.sayHi();

	ok(foo.count === 3, 'Pointcuts over constructor must get called');
	ok(foo.say === 3, 'Pointcuts over method must get called');
	delete jsface.tests;
});

test('Pointcuts over constructor and method, specified by $meta', function() {
	var pointcuts = {
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
	};

	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests,
			pointcuts: pointcuts
		},

		Foo: function() {
			this.count++;
		},

		sayHi: function() {
			this.say++;
		}
	});

	var foo = new jsface.tests.Foo();
	foo.sayHi();

	ok(foo.count === 3, 'Pointcuts over constructor must get called');
	ok(foo.say === 3, 'Pointcuts over method must get called');

	delete jsface.tests;
});

test('Pointcuts over static method', function() {
	var count = 0;

	jsface.namespace('jsface.tests');

	jsface.def({
		$meta: {
			name: 'Foo',
			namespace: jsface.tests,
			statics: [ 'sayHi' ]
		},
		sayHi: function() {
			count++;
		}
	});

	jsface.pointcuts(jsface.tests.Foo, {
		sayHi: {
			before: function() {
				count++;
			},
			after: function() {
				count++;
			}
		}
	});

	var foo = new jsface.tests.Foo();

	jsface.tests.Foo.sayHi();
	ok(count === 3, 'Pointcuts over static method must get called');
	foo.sayHi();
	ok(count === 6, 'Pointcuts over static method must get called via class instance');

	delete jsface.tests;
});

test('Pointcuts over a built-in class', function() {
	var before, after;

	jsface.pointcuts(String, {
		concat: {
			before: function() {
				before = true;
			},
			after: function() {
				after = true;
			}
		}
	});

	'Hello '.concat('World');

	ok(before, 'before pointcut on String.prototype.concat must get called');
	ok(after, 'after pointcut on String.prototype.concat must get called');
});

test('Pointcuts on jsface itself', function() {
	var before, after;

	jsface.pointcuts(jsface, {
		namespace: {
			before: function() {
				before = true;
			},
			after: function() {
				after = true;
			}
		}
	});

	jsface.namespace('jsface.tests.foo.bar.test');

	ok(before, 'before pointcut on jsface.namespace must get called');
	ok(after, 'after pointcut on jsface.namespace must get called');
	delete jsface.tests;
});
