module('Utils Tests');

test('jsface.namespace', function() {
	jsface.namespace('jsface.tests.foo.bar');
	ok(jsface.tests, 'com namespace must exists');
	ok(jsface.tests.foo, 'com.foo namespace must exists');
	ok(jsface.tests.foo.bar, 'com.foo.bar namespace must exists');
});

test('jsface.namespace: invalid param', function() {
	raises(function() {
		jsface.namespace('com. foo');
	}, 'An exception must be thrown for an invalid namespace');
});

test('jsface.each - over array', function() {
	var sum1 = 1 + 2 + 3 + 4, sum2 = 0;
	jsface.each([1, 2, 3, 4], function(value) {
		sum2 += value;
	});
	equal(sum2, sum1, 'jsface.each works incorrectly');
});

test('jsface.each - over map', function() {
	var map = { one: 1, two: 2, three: 3 },
		keys = [],
		sum = 0;
	jsface.each(map, function(key, value) {
		keys.push(key);
		sum += value;
	});
	equal(sum, 6, 'jsface.each works incorrectly over map');
	equal(keys.join(' '), 'one two three', 'jsface.each works incorrectly over map');
});

test('jsface.each - over string', function() {
	var str = 'abcdef',
		keys = [];
	jsface.each(str, function(value, index) {
		keys.push(value);
	});
	equal(keys.join(''), str, 'jsface.each works incorrectly over string');
});

test('jsface.each - over function', function() {
	var fn = function() {}, keys = [], sum = 0;

	fn.one = 1;
	fn.two = 2;
	fn.three = 3;

	jsface.each(fn, function(key, value) {
		sum += value;
		keys.push(key);
	});
	equal(sum, 6, 'jsface.each works incorrectly over function');
	equal(keys.join(' '), 'one two three', 'jsface.each works incorrectly over function');
});

test('jsface.merge', function() {
	var map1 = { one: 0, two: 2 },
		map2 = { one: 1, three: 3 },
		map = jsface.merge(map1, map2);

	equal(map.one, 1, 'jsface.merge works incorrectly');
	equal(map.two, 2, 'jsface.merge works incorrectly');
	equal(map.three, 3, 'jsface.merge works incorrectly');
});

test('jsface.global', function() {
	jsface.global('MyFooObject', { one: 1, two: 2, three: 3 });

	ok(MyFooObject, 'jsface.global works incorrectly');
	equal(MyFooObject.one, 1, 'jsface.global works incorrectly');
	equal(MyFooObject.two, 2, 'jsface.global works incorrectly');
	equal(MyFooObject.three, 3, 'jsface.global works incorrectly');
});

test('jsface.bindProperties', function() {
	var MyFooObject = {};

	jsface.bindProperties(MyFooObject, { one: 1, two: 2, three: 3 });

	equal(MyFooObject.one, 1, 'jsface.bindProperties works incorrectly');
	equal(MyFooObject.two, 2, 'jsface.bindProperties works incorrectly');
	equal(MyFooObject.three, 3, 'jsface.bindProperties works incorrectly');
});

test('jsface.isMap', function() {
	ok(jsface.isMap({}), 'jsface.isMap works incorrectly');
	ok(jsface.isMap({ one: 1, two: 2 }), 'jsface.isMap works incorrectly');

	ok( !jsface.isMap(), 'jsface.isMap works incorrectly');
	ok( !jsface.isMap(''), 'jsface.isMap works incorrectly');
	ok( !jsface.isMap('Hello'), 'jsface.isMap works incorrectly');
	ok( !jsface.isMap([]), 'jsface.isMap works incorrectly');
	ok( !jsface.isMap([ 1, 2, 3 ]), 'jsface.isMap works incorrectly');
	ok( !jsface.isMap(1), 'jsface.isMap works incorrectly');
	ok( !jsface.isMap(jsface.noop), 'jsface.isMap works incorrectly');
});

test('jsface.isMap on iframe', function() {
	var iframe, IObject;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	IObject = window.frames[window.frames.length - 1].Object;

	var map = new IObject();
	map.one = 1;
	map.two = 2;

	ok(jsface.isMap(map), 'jsface.isMap works incorrectly in iframe');
	document.body.removeChild(iframe);
});

test('jsface.isArray', function() {
	ok(jsface.isArray([]), 'jsface.isArray works incorrectly');
	ok(jsface.isArray([ 1, 2, 3, 4 ]), 'jsface.isArray works incorrectly');
	ok( !jsface.isArray(), 'jsface.isArray works incorrectly');

	// jsface.isArray does not consider String as Array of characters
	ok( !jsface.isArray(''), 'jsface.isArray works incorrectly');
	ok( !jsface.isArray('Hello'), 'jsface.isArray works incorrectly');
	ok( !jsface.isArray({}), 'jsface.isArray works incorrectly');
	ok( !jsface.isArray({ one: 1, two: 2 }), 'jsface.isArray works incorrectly');
	ok( !jsface.isArray(1), 'jsface.isArray works incorrectly');
	ok( !jsface.isArray(jsface.noop), 'jsface.isArray works incorrectly');
});

test('jsface.isArray on iframe', function() {
	var iframe, IArray, array;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	IArray = window.frames[window.frames.length - 1].Array;

	array = new IArray(1, 2, 3);

	ok(jsface.isArray(array), 'jsface.isArray works incorrectly in iframe');
	document.body.removeChild(iframe);
});

test('jsface.isFunction', function() {
	ok(jsface.isFunction(function(){}), 'jsface.isFunction works incorrectly');
	ok(jsface.isFunction(jsface.noop), 'jsface.isFunction works incorrectly');

	ok( !jsface.isFunction([]), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction([ 1, 2, 3, 4 ]), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction(), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction(''), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction('Hello'), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction({}), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction({ one: 1, two: 2 }), 'jsface.isFunction works incorrectly');
	ok( !jsface.isFunction(1), 'jsface.isFunction works incorrectly');
});

test('jsface.isFunction on iframe', function() {
	var iframe, IFunction, fn;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	IFunction = window.frames[window.frames.length - 1].Function;

	fn = new IFunction();
	ok(jsface.isFunction(fn), 'jsface.isFunction works incorrectly');
	document.body.removeChild(iframe);
});

test('jsface.isBoolean', function() {
	ok(jsface.isBoolean(true), 'jsface.isBoolean works incorrectly');
	ok(jsface.isBoolean(false), 'jsface.isBoolean works incorrectly');

	ok( !jsface.isBoolean(function(){}), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean([]), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean([ 1, 2, 3, 4 ]), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean(), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean(''), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean('Hello'), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean({}), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean({ one: 1, two: 2 }), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean(1), 'jsface.isBoolean works incorrectly');
	ok( !jsface.isBoolean(jsface.noop), 'jsface.isBoolean works incorrectly');
});

test('jsface.isBoolean on iframe', function() {
	var iframe, IType;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	IType = window.frames[window.frames.length - 1].Boolean;

	ok(jsface.isBoolean(new IType(true)), 'jsface.isBoolean works incorrectly');
	ok(jsface.isBoolean(new IType(false)), 'jsface.isBoolean works incorrectly');
	document.body.removeChild(iframe);
});

test('jsface.isNumber', function() {
	ok(jsface.isNumber(1), 'jsface.isNumber works incorrectly on integer');
	ok(jsface.isNumber(01234), 'jsface.isNumber works incorrectly on octal numbers');
	ok(jsface.isNumber(123400.990), 'jsface.isNumber works incorrectly on float');

	ok( !jsface.isNumber(true), 'jsface.isNumber works incorrectly on true');
	ok( !jsface.isNumber(false), 'jsface.isNumber works incorrectly on false');
	ok( !jsface.isNumber(function(){}), 'jsface.isNumber works incorrectly on function');
	ok( !jsface.isNumber([]), 'jsface.isNumber works incorrectly on empty array');
	ok( !jsface.isNumber([ 1, 2, 3, 4 ]), 'jsface.isNumber works incorrectly on array');
	ok( !jsface.isNumber(), 'jsface.isNumber works incorrectly on undefined');
	ok( !jsface.isNumber(''), 'jsface.isNumber works incorrectly on empty string');
	ok( !jsface.isNumber('Hello'), 'jsface.isNumber works incorrectly on string');
	ok( !jsface.isNumber({}), 'jsface.isNumber works incorrectly on empty map');
	ok( !jsface.isNumber({ one: 1, two: 2 }), 'jsface.isNumber works incorrectly on map');
	ok( !jsface.isNumber(jsface.noop), 'jsface.isNumber works incorrectly on jsface.noop');
});

test('jsface.isNumber on iframe', function() {
	var iframe, IType;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	IType = window.frames[window.frames.length - 1].Number;

	ok(jsface.isNumber(new IType(1)), 'jsface.isNumber works incorrectly');
	ok(jsface.isNumber(new IType(123.433)), 'jsface.isNumber works incorrectly');
	document.body.removeChild(iframe);
});

test('jsface.isUndefined', function() {
	ok(jsface.isUndefined(), 'jsface.isUndefined works incorrectly');
	ok(jsface.isUndefined(undefined), 'jsface.isUndefined works incorrectly undefined');

	ok( !jsface.isUndefined(true), 'jsface.isUndefined works incorrectly on true');
	ok( !jsface.isUndefined(false), 'jsface.isUndefined works incorrectly on false');
	ok( !jsface.isUndefined(function(){}), 'jsface.isUndefined works incorrectly on function');
	ok( !jsface.isUndefined([]), 'jsface.isUndefined works incorrectly on empty array');
	ok( !jsface.isUndefined([ 1, 2, 3, 4 ]), 'jsface.isUndefined works incorrectly on array');
	ok( !jsface.isUndefined(''), 'jsface.isUndefined works incorrectly on empty string');
	ok( !jsface.isUndefined('Hello'), 'jsface.isUndefined works incorrectly on string');
	ok( !jsface.isUndefined({}), 'jsface.isUndefined works incorrectly on empty map');
	ok( !jsface.isUndefined({ one: 1, two: 2 }), 'jsface.isUndefined works incorrectly on map');
});

test('jsface.isUndefined on iframe', function() {
	var iframe, type;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	type = window.frames[window.frames.length - 1].undefined;

	ok(jsface.isUndefined(type), 'jsface.isUndefined works incorrectly on iframe');
	document.body.removeChild(iframe);
});

test('jsface.isNull', function() {
	var foo = null;

	ok(jsface.isNull(null), 'jsface.isNull works incorrectly');
	ok(jsface.isNull(foo), 'jsface.isNull works incorrectly on variable');

	ok( !jsface.isNull(), 'jsface.isNull works incorrectly on default param');
	ok( !jsface.isNull(undefined), 'jsface.isNull works incorrectly undefined');
	ok( !jsface.isNull(true), 'jsface.isNull works incorrectly on true');
	ok( !jsface.isNull(false), 'jsface.isNull works incorrectly on false');
	ok( !jsface.isNull(function(){}), 'jsface.isNull works incorrectly on function');
	ok( !jsface.isNull([]), 'jsface.isNull works incorrectly on empty array');
	ok( !jsface.isNull([ 1, 2, 3, 4 ]), 'jsface.isNull works incorrectly on array');
	ok( !jsface.isNull(''), 'jsface.isNull works incorrectly on empty string');
	ok( !jsface.isNull('Hello'), 'jsface.isNull works incorrectly on string');
	ok( !jsface.isNull({}), 'jsface.isNull works incorrectly on empty map');
	ok( !jsface.isNull({ one: 1, two: 2 }), 'jsface.isNull works incorrectly on map');
});

test('jsface.isNull on iframe', function() {
	var iframe, type;

	iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	type = window.frames[window.frames.length - 1].null;

	//ok(jsface.isNull(type), 'jsface.isNull works incorrectly on iframe');
	// always fail: not the correct way to test, should have a script on iframe
	// and return value to parent as null in the iframe
	document.body.removeChild(iframe);
});

test('jsface.isNullOrUndefined', function() {
	ok(jsface.isNullOrUndefined(), 'jsface.isNullOrUndefined works incorrectly');
	ok(jsface.isNullOrUndefined(undefined), 'jsface.isNullOrUndefined works incorrectly undefined');
	ok(jsface.isNullOrUndefined(null), 'jsface.isNullOrUndefined works incorrectly undefined');

	ok( !jsface.isNullOrUndefined(true), 'jsface.isNullOrUndefined works incorrectly on true');
	ok( !jsface.isNullOrUndefined(false), 'jsface.isNullOrUndefined works incorrectly on false');
	ok( !jsface.isNullOrUndefined(function(){}), 'jsface.isNullOrUndefined works incorrectly on function');
	ok( !jsface.isNullOrUndefined([]), 'jsface.isNullOrUndefined works incorrectly on empty array');
	ok( !jsface.isNullOrUndefined([ 1, 2, 3, 4 ]), 'jsface.isNullOrUndefined works incorrectly on array');
	ok( !jsface.isNullOrUndefined(''), 'jsface.isNullOrUndefined works incorrectly on empty string');
	ok( !jsface.isNullOrUndefined('Hello'), 'jsface.isNullOrUndefined works incorrectly on string');
	ok( !jsface.isNullOrUndefined({}), 'jsface.isNullOrUndefined works incorrectly on empty map');
	ok( !jsface.isNullOrUndefined({ one: 1, two: 2 }), 'jsface.isNullOrUndefined works incorrectly on map');
});

test('jsface.isEmpty', function() {
	ok(jsface.isEmpty(), 'jsface.isEmpty works incorrectly passing empty param');
	ok(jsface.isEmpty(undefined), 'jsface.isEmpty works incorrectly undefined');
	ok(jsface.isEmpty(null), 'jsface.isEmpty works incorrectly on null');
	ok(jsface.isEmpty(''), 'jsface.isEmpty works incorrectly empty string');
	ok(jsface.isEmpty('   '), 'jsface.isEmpty works incorrectly blank string');
	ok(jsface.isEmpty({}), 'jsface.isEmpty works incorrectly empty map');
	ok(jsface.isEmpty([]), 'jsface.isEmpty works incorrectly empty array');

	ok( !jsface.isEmpty(0), 'jsface.isEmpty works incorrectly on 0');
	ok( !jsface.isEmpty(1), 'jsface.isEmpty works incorrectly on 1');
	ok( !jsface.isEmpty(true), 'jsface.isEmpty works incorrectly on true');
	ok( !jsface.isEmpty(false), 'jsface.isEmpty works incorrectly on false');
	ok( !jsface.isEmpty(function(){}), 'jsface.isEmpty works incorrectly on function');
	ok( !jsface.isEmpty([ 1, 2, 3, 4 ]), 'jsface.isEmpty works incorrectly on array');
	ok( !jsface.isEmpty('Hello'), 'jsface.isEmpty works incorrectly on string');
	ok( !jsface.isEmpty({ one: 1, two: 2 }), 'jsface.isEmpty works incorrectly on map');
});

test('jsface.isClass', function() {
	jsface.def({
		$meta: { name: 'MyFooClass' }
	});
	ok(jsface.isClass(function(){}), 'jsface.isClass works incorrectly on function');
	ok(jsface.isClass(MyFooClass), 'jsface.isClass works incorrectly on jsface class');

	ok( !jsface.isClass(), 'jsface.isClass works incorrectly passing empty param');
	ok( !jsface.isClass(undefined), 'jsface.isClass works incorrectly undefined');
	ok( !jsface.isClass(null), 'jsface.isClass works incorrectly on null');
	ok( !jsface.isClass(''), 'jsface.isClass works incorrectly empty string');
	ok( !jsface.isClass('   '), 'jsface.isClass works incorrectly blank string');
	ok( !jsface.isClass({}), 'jsface.isClass works incorrectly empty map');
	ok( !jsface.isClass([]), 'jsface.isClass works incorrectly empty array');
	ok( !jsface.isClass(0), 'jsface.isClass works incorrectly on 0');
	ok( !jsface.isClass(1), 'jsface.isClass works incorrectly on 1');
	ok( !jsface.isClass(true), 'jsface.isClass works incorrectly on true');
	ok( !jsface.isClass(false), 'jsface.isClass works incorrectly on false');
	ok( !jsface.isClass([ 1, 2, 3, 4 ]), 'jsface.isClass works incorrectly on array');
	ok( !jsface.isClass('Hello'), 'jsface.isClass works incorrectly on string');
	ok( !jsface.isClass({ one: 1, two: 2 }), 'jsface.isClass works incorrectly on map');
});

test('jsface.isIdentifier', function() {
	ok(jsface.isIdentifier('jsface'), 'jsface.isIdentifier works incorrectly');
	ok(jsface.isIdentifier('JSFACE'), 'jsface.isIdentifier works incorrectly');
	ok(jsface.isIdentifier('$meta'), 'jsface.isIdentifier works incorrectly');
	ok(jsface.isIdentifier('_meta'), 'jsface.isIdentifier works incorrectly');
	ok( !jsface.isIdentifier(' _meta'), 'jsface.isIdentifier works incorrectly');
	ok( !jsface.isIdentifier('_ meta'), 'jsface.isIdentifier works incorrectly');
});

test('jsface.trim', function() {
	equal(jsface.trim('jsface '), 'jsface', 'jsface.trim works incorrectly');
	equal(jsface.trim(' jsface '), 'jsface', 'jsface.trim works incorrectly');
	equal(jsface.trim('   jsface '), 'jsface', 'jsface.trim works incorrectly');
	equal(jsface.trim(1), 1, 'jsface.trim works incorrectly');
});

test('jsface.overload - array', function() {
	var countAPIs = [
	    function() {
	    	return 0;
	    },
	    function(n) {
	    	return n;
	    },
	    function(a, b) {
	    	return a + b;
	    }
	], fn;

	fn = jsface.overload('count', countAPIs);

	equal(fn(), 0, 'jsface.overload works incorrectly');
	equal(fn(1, 2, 3, 4), 0, 'jsface.overload works incorrectly');
	equal(fn(10), 10, 'jsface.overload works incorrectly');
	equal(fn(5, 6), 11, 'jsface.overload works incorrectly');
});

test('jsface.overload - map', function() {
	var countAPIs = {
	    0: function() {
	    	return 0;
	    },
	    'Number': function(n) {
	    	return n;
	    },
	    'Number, Number': function(a, b) {
	    	return a + b;
	    }
	}, fn;

	fn = jsface.overload('count', countAPIs);

	equal(fn(), 0, 'jsface.overload works incorrectly');
	equal(fn(1, 2, 3, 4), 0, 'jsface.overload works incorrectly');
	equal(fn(1, 2, 'Hello World'), 0, 'jsface.overload works incorrectly');
	equal(fn(10), 10, 'jsface.overload works incorrectly');
	equal(fn(5, 6), 11, 'jsface.overload works incorrectly');

	raises(function() {
		fn('Hello World');
	}, 'Exception must be thrown for an invalid type parameter');
	raises(function() {
		fn('Hello World', 1);
	}, 'Exception must be thrown for an invalid type parameter');
	raises(function() {
		fn(1, 'Hello World');
	}, 'Exception must be thrown for an invalid type parameter');
});

test('jsface.overload - map - type checking', function() {
	var countAPIs = {
	    'Number: it > 0': function(n) {
	    	return n;
	    },
	    'Number: it > 0, Number: it > 0': function(a, b) {
	    	return a + b;
	    }
	}, fn;

	fn = jsface.overload('count', countAPIs);

	equal(fn(10), 10, 'jsface.overload works incorrectly');
	equal(fn(5, 6), 11, 'jsface.overload works incorrectly');

	raises(function() {
		fn('Hello World');
	}, 'Exception must be thrown for an invalid type parameter');
	raises(function() {
		fn('Hello World', 1);
	}, 'Exception must be thrown for an invalid type parameter');
	raises(function() {
		fn(1, 'Hello World');
	}, 'Exception must be thrown for an invalid type parameter');
	raises(function() {
		fn(0);
	}, 'Exception must be thrown for parameter validation');
	raises(function() {
		fn(0, 1);
	}, 'Exception must be thrown for parameter validation');
	raises(function() {
		fn(1, 0);
	}, 'Exception must be thrown for parameter validation');
});
