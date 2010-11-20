module('Utils Tests');

test('Declare a namespace', function(){
	jsface.namespace('jsface.tests.foo.bar');
	ok(jsface.tests, 'com namespace must exists');
	ok(jsface.tests.foo, 'com.foo namespace must exists');
	ok(jsface.tests.foo.bar, 'com.foo.bar namespace must exists');
});

test('Declare an invalid namespace', function(){
	raises(function(){
		jsface.namespace('com. foo');
	}, 'An exception must be thrown for an invalid namespace');
});

test('Loop by jsface.each', function(){
	var sum1 = 1 + 2 + 3 + 4, sum2 = 0;
	jsface.each([1, 2, 3, 4], function(value){
		sum2 += value;
	});
	equal(sum2, sum1, 'jsface.each works incorrectly');
});
