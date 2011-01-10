/*
 * jsFace JavaScript Object Oriented Programming Library
 *
 * https://github.com/tannhu/jsface
 *
 * Copyright (c) 2010 Tan Nhu
 * Dual licensed under the MIT and GPL version 2 licenses.
 * $Date: Saturday, March 07 2009 $
 */
(function() {

"use strict";

var jsface = {

	version: "1.2b",

	/**
	 * Create a namespace hierarchy. If one namespace in chain exists, it will be reused.
	 * @param {String} namespace
	 * @return null if namespace is invalid. otherwise, return the namespace object.
	 * Example: var ns = jsface.namespace("com.jsface.widgets"); // ns becomes com.jsface.widgets
	 */
	namespace: function(namespace) {
		if (jsface.isString(namespace)) {
			var names = namespace.split("."), len = names.length, root, i;

			// Check each name using regular expression
			// Condition: Begin with an alphabet character, follow by alphabets or numbers
			for (i in names) {
				if ( !jsface.isIdentifier(names[i])) {
					throw names[i] + " is not a valid namespace alias";
				}
			}

			root = new Function("try { return " + names[0] + "; } catch (e) { return " + names[0] + " = {}; }")();

			for (i = 1; i < len; i++) {
				if ( !root[names[i]]) {   // Create if namespace does not exist
					root[names[i]] = {};
				}
				root = root[names[i]];
			}
			return root;
		}
		return null;
	},

	/**
	 * For each loop over a collection (a string, an array, an object (a map with pairs of {key:value})),
	 * or a function (over all static properties).
	 * + each(collection, fn)
	 * + each(collection, predicate, fn)
	 *
	 * If collection is a string or an array, predicate and fn are executed over each item as:
	 *    predicate(value, index)
	 *    fn(value, index)
	 * Otherwise, they are executed as:
	 *    predicate(key, value)
	 *    fn(key, value)
	 * In case predicate is specified, over each item when it returns true, fn will be executed, if not, fn is skipped.
	 *
	 * Return true on fn will stop the iteration.
	 *
	 * This each() function supports string, array, object, and function.
	 */
	each: function() {
		var len = arguments.length, collection, predicate, fn, item, isArray, isMap, isFunction, ret, i;

		switch (len) {
			case 2: // just collection and function
				collection = arguments[0];
				fn = arguments[1];
				break;
			case 3: // collection, predicate and function
				collection = arguments[0];
				predicate = arguments[1];
				fn = arguments[2];
				break;
			default:
				return;
		}

		isArray = jsface.isArray(collection) || jsface.isString(collection);
		isMap = jsface.isMap(collection);
		isFunction = jsface.isFunction(collection);

		// Skip processing if collection is not String, Array, or Map
		if ( !isArray && !isMap && !isFunction) {
			return;
		}

		// If no predicate is passed, execute fn over all elements. Otherwise, over the condition of predicate only
		if (len === 2) {
			if (isArray) {
				len = collection.length;
				for (i = 0; i < len; i++) {
					ret = fn(collection[i], i);
					if (ret === true) {
						break;
					}
				}
			} else {
				for (item in collection) {
					ret = fn(item, collection[item]);
					if (ret === true) {
						break;
					}
				}
			}
		} else {
			if (isArray) {
				len = collection.length;
				for (i = 0; i < len; i++) {
					if (predicate(collection[i], i)) {
						ret = fn(collection[i], i);
						if (ret === true) {
							break;
						}
					}
				}
			} else {
				for (item in collection) {
					if (predicate(item, collection[item])) {
						ret = fn(item, collection[item]);
						if (ret === true) {
							break;
						}
					}
				}
			}
		}
	},

	/**
	 * Merge data objects.
	 * + var m = merge(obj1, obj2, ...);
	 * Argument objects must be object ({}). Arguments won't be changed.
	 * The priority is right to left, parameters on the right have higher priority than
	 * parameters on the left. That means if there is one value duplicated, value of the
	 * right parameter will be used.
	 */
	merge: function() {
		var	args = [].concat(Array.prototype.slice.apply(arguments)),
			result = null, first, second;

		switch (args.length) {
			case 0:
			case 1:
				break;
			case 2:
				first = args[0] || {};
				second = args[1] || {};
				if (jsface.isMap(first) && jsface.isMap(second)) {
					result = {};
					jsface.each(first, function(fKey, fValue) {
						result[fKey] = fValue;
					});
					jsface.each(second, function(sKey, sValue) {
						result[sKey] = sValue;
					});
				}
				break;
			default:
				first = args.shift();
				result = jsface.merge(first, jsface.merge.apply(jsface, args));
				break;
		}
		return result;
	},

	/**
	 * Make a global object.
	 * @param {String} name object name.
	 * @param {Object/Any} value object value.
	 * @return the global object.
	 */
	global: function(name, value) {
		if (jsface.isIdentifier(name)) {
			return new Function("value", "return " + name + " = value;")(value);
		} else {
			throw "jsface.global: Invalid global name " + name;
		}
	},

	/**
	 * Bind properties from a map to an object.
	 * @param {Object} obj object.
	 * @param {Map} map properties.
	 */
	bindProperties: function(obj, map) {
		if (obj && jsface.isMap(map)) {
			jsface.each(map, function(key, value) {
				obj[key] = value;
			});
		}
	},

	/**
	 * Check an object is a map or not. A map is something like { key1: value1, key2: value2 }.
	 * @param {Object} obj
	 * @return true if obj is a map, false if not.
	 */
	isMap: function(obj) {
		return (obj && typeof obj === "object" && !(typeof obj.length === "number" && !(obj.propertyIsEnumerable("length"))));
	},

	/**
	 * Check an object is an array or not. An array is something like [].
	 * @param {Object} obj
	 * @return true if obj is an array, false if not.
	 */
	isArray: function(obj) {
		return (obj && typeof obj === "object" && typeof obj.length === "number" && !(obj.propertyIsEnumerable("length")));
	},

	/**
	 * Check an object is a function or not.
	 * @param {Object} obj
	 * @return true if obj is a function, false if not.
	 */
	isFunction: function(obj) {
		return (obj && typeof obj === "function");
	},

	/**
	 * Check an object is a string not.
	 * @param {Object} obj
	 * @return true if obj is a string, false if not.
	 */
	isString: function(obj) {
		return Object.prototype.toString.apply(obj) === "[object String]";
	},

	/**
	 * Check an object is a boolean or not.
	 * @param {Object} obj
	 * @return true if obj is a boolean object, false if not.
	 */
	isBoolean: function(obj) {
		return Object.prototype.toString.apply(obj) === "[object Boolean]";
	},

	/**
	 * Check an object is a number or not.
	 * @param {Object} obj
	 * @return true if obj is a number, false if not.
	 */
	isNumber: function(obj) {
		return Object.prototype.toString.apply(obj) === "[object Number]";
	},

	/**
	 * Check an object is undefined or not.
	 * @param {Object} obj
	 * @return true if obj is undefined, false if not.
	 */
	isUndefined: function(obj) {
		return (obj === undefined);
	},

	/**
	 * Check an object is null or not.
	 * @param {Object} obj
	 * @return true if obj is null, false if not.
	 */
	isNull: function(obj) {
		return (obj === null);
	},

	/**
	 * Check an object is null or undefined.
	 * @param {Object} obj object to check
	 * @return true if the object is null or undefined, false if not.
	 */
	isNullOrUndefined: function(obj) {
		return (obj === undefined || obj === null);
	},

	/**
	 * Check an object is empty or not. An empty object is either null, undefined, "", [], or {}.
	 * A string contains blank spaces (blank, tab, etc.) also is treated as an empty string.
	 * @param {Object} obj object to check
	 * @return true if the object is empty.
	 */
	isEmpty: function(obj) {
		return (obj === undefined || obj === null || (jsface.isString(obj) && jsface.trim(obj) === "") || (jsface.isArray(obj) && obj.length === 0) || (jsface.isMap(obj) && (function(ob) { for (var i in ob) { return false; } return true; })(obj)));
	},

	/**
	 * Check an object is a class (not an instance of a class, which is a map) or not.
	 * @param {Object} clazz object to check
	 * @return true if the object is a class, false if not.
	 */
	isClass: function(clazz) {
		return jsface.isFunction(clazz) && (clazz === clazz.prototype.constructor);
	},

	/**
	 * Check a name is a valid JavaScript identifier. Note that this function does not support Unicode name but English only.
	 * It also does not check for JavaScript reserved keywords.
	 * @param {String} id identifier to check.
	 * @return {Boolean} true if id is a valid JavaScript literal.
	 */
	isIdentifier: function(id) {
		return /^[a-zA-Z_$]+[0-9a-zA-Z_$]+$/.test(id);
	},

	/**
	 * Empty function.
	 */
	noop: function() {},

	/**
	 * Trim a string. If str is not a string, the whole object will be returned.
	 * @param str string to trim
	 * @return trimmed string.
	 * @see http://tinyurl.com/yl934kz
	 */
	trim: function(str) {
		var	chars = " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000",
			ws = {}, len = chars.length;

		while (len--) {
			ws[chars.charAt(len)] = true;
		}

		jsface.trim = function(str) {
			if ( !jsface.isString(str)) {
				return str;
			}
			if (String.prototype.trim) {
				return String.prototype.trim.apply(str);
			}
			var s = -1, e = str.length;
			while (ws[str.charAt(--e)]);
			while (s++ !== e && ws[str.charAt(s)]);
			return str.substring(s, e + 1);
		};
		return jsface.trim(str);
	},

	/**
	 * Capitalize a string.
	 * @param String str source string
	 * @return Capitalized version of str.
	 */
	capitalize: function(str) {
		 return jsface.isString(str) ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
	},

	/**
	 * Get actual object from its name.
	 * @param String name object's string representation.
	 * @return Object object's actual representation or undefined.
	 */
	fromString: function(name) {
		return new Function("try { return " + name + "; } catch (e) {} return undefined;")();
	},

	/**
	 * Make overloading methods.
	 *
	 * @param {Object} methodName method name or description, for debugging.
	 * @param {Object} api actual method implementation of the method.
	 * @return {Function} function supports all declared overloading.
	 * @throw {Exception} if there is an error in an overloading method.
	 */
	overload: function() {
		/*
		 * Make overloading method in case api is declared as an array.
		 * @param {String} methodName method name.
		 * @param {Array} api api declared as an array.
		 * @return {Function} function supports all declared overloading.
		 * @throw {Exception} if there is an error in an overloading method.
		 */
		function makeOverloadingArray(methodName, api) {
			// It is an array, check the length
			if (api.length === 0) {
				return api;
			}

			// Ok, it is an array, check if it is not a method but a normal array property
			for (var idx in api) {
				if ( !jsface.isFunction(api[idx])) {
					return api;
				}
			}

			// Now it is an overloading method. If there is only one overloading, ignore wrapping
			if (api.length === 1) {
				return api[0];
			}

			// Make wrapper
			return function() {
				var len = arguments.length, defaultFn = null, idx;

				for (idx in api) {
					if (api[idx].length === len) {
						return api[idx].apply(this, arguments);
					} else if (api[idx].length === 0) {
						defaultFn = api[idx];
					}
				}

				// Still not match? How about passing to the default method which does not declare any argument?
				if (defaultFn) {
					return defaultFn.apply(this, arguments);
				} else { // No method supports arguments.length? Throw an exception
					throw "jsface.overload: " + methodName + "() does not accept " + len + " arguments";
				}
			};
		}

		/*
		 * Make overloading method in case api is declared as an object.
		 * @param {String} methodName method name.
		 * @param {Object} api api declared as an object.
		 * @return {Function} function supports all declared overloading.
		 * @throw {Exception} if there is an error in an overloading method.
		 */
		function makeOverloadingObject(methodName, api) {
			/*
			 * Make evaluator function for an argument of a overriding function.
			 */
			function makeEvaluator(expression, typeDefsString) {
				var s = "(function() { return function(it) { return (" + expression + ") === true; }})();";
				try {
					return eval(s);
				} catch (error) {
					throw "jsface.overload: Invalid validating expression: " + expression + " on overloading method " + methodName + "(" + typeDefsString + ")";
				}
			}

			/*
			 * Transform types definition for a overriding function.
			 * typeDefs ~ ["string", "string: it != null"]
			 *	>>: [{ name: "string", type: String },
			 *		   { name: "String", type: String, expression: "it != null", evaluator: function(it) { return (it != null) === true; }]
			 * @param typeDefs array of type definitions.
			 * @param typeDefsString the whole string represent types definition of the method.
			 */
			function transformTypes(typeDefs, typeDefsString) {
				var result = [];

				jsface.each(typeDefs, function(typeDef, index) {
					typeDef = jsface.trim(typeDef);
					var name, type, expression, evaluator, colon = typeDef.indexOf(":");

					if (colon === -1) {
						name = typeDef;
					} else {
						name = typeDef.substring(0, colon);
						expression = typeDef.substring(colon + 1, typeDef.length);
						evaluator = makeEvaluator(expression, typeDefsString);
					}
					try {
						type = eval(name);
					} catch (error) {
						throw "jsface.overload: Type " + name + " is not defined on overloading method " + methodName + "(" + typeDefsString + ")";
					}
					result.push({
						name: name,
						type: type,
						expression: expression,
						evaluator: evaluator
					});
				});
				return result;
			}

			/*
			 * Determine type of an argument.
			 */
			function getType(obj) {
				if (jsface.isString(obj)) {
					return String;
				}
				if (jsface.isArray(obj)) {
					return Array;
				}
				if (jsface.isNumber(obj)) {
					return Number;
				}
				if (jsface.isFunction(obj)) {
					return Function;
				}
				if (jsface.isBoolean(obj)) {
					return Boolean;
				}

				// Try to guess obj is a class created by jsface
				try {
					if (jsface.isString(obj.classMeta.name)) {
						return eval(obj.classMeta.name);
					}
				} catch (error) {}

				// All other objects will be marked as Object type
				return Object;
			}

			/*
			 * Check that arguments passing to call function matches an overriding function or not.
			 */
			function isMatched(args, len, typeInfo) {
				var i, type, name, arg;
				for (i = 0; i < len; i++) {
					type = typeInfo[i].type;
					name = typeInfo[i].name;
					arg = args[i];

					if (getType(arg) !== type && !(arg === null && (type === String || type === Array || type === Object))) {
						return false;
					}
				}
				return true;
			}

			/*
			 * Build method signature for debugging.
			 */
			function buildMethodSignature(typeItem, args, len) {
				var s = methodName + "(", i;
				for (i = 0; i < len - 1; i++) {
					s += typeItem.types[i].name + ": " + args[i] + ", ";
				}
				s += typeItem.types[len - 1].name + ": " + args[len - 1] + ")";
				return s;
			}

			/*
			 * Select an overriding function to execute function with passing arguments.
			 */
			function selectHandler(context, mapItem, len, args) {
				var matches = [], typeItem, i, s;

				// Iterator over mapItem, if arguments match types definition, push matched meta in matches
				jsface.each(mapItem, function(item, index) {
					if (isMatched(args, len, item.types)) {
						matches.push(item);
					}
				});

				// There are more than one methods matched, check to remove methods which arguments do not pass evaluators
				if (matches.length > 1) {
					jsface.each(matches, function(typeItem, index) {
						for (i = 0; i < len; i++) {
							var evaluator = typeItem.types[i].evaluator;
							if (evaluator) {
								if (evaluator.call(context, args[i]) === false) {
									matches.splice(index, 1);
								}
							}
						}
					});
				}

				// Only one method matched, great, it is the method for arguments
				if (matches.length === 1) {
					typeItem = matches[0];
					for (i = 0; i < len; i++) {
						var evaluator = typeItem.types[i].evaluator;
						if (evaluator) {
							if (evaluator.call(context, args[i]) !== true) {
								throw buildMethodSignature(typeItem, args, len) +
									". Validating error at parameter " + (i + 1) + ", expression: " +
									typeItem.types[i].expression;
							}
						}
					}
					return typeItem.fn.apply(context, args);
				}

				// Prepare error message
				s = methodName + "(";
				for (i = 0; i < len - 1; i++) {
					s += args[i] + ", ";
				}
				s += args[len - 1] + "). Check argument types and values.";

				// Something wrong here
				if (matches.length === 0) {
					throw "No overloading method matches the call " + s;
				} else {
					throw "Vague arguments on calling " + s;
				}
			}

			// Where to store all information about the method
			var overloadingsMeta = {};

			// Push default overloadingsMeta
			if (jsface.isFunction(api["0"])) {
				overloadingsMeta["0"] = [{
					fn: api["0"]
				}];
			}

			// Pre-check, and process types during the checking time
			for (var key in api) {
				// Check for sure that the whole contents are key:function
				if ( !jsface.isFunction(api[key])) {
					return api;
				}

				// Skip checking default handler
				if (key === "0") {
					continue;
				}

				var typeDefs = key.split(","), f = api[key];

				// If there is only one typeDef, and it's not a type, skip processing: return AS IS
				if (typeDefs.length === 1) {
					if ( !jsface.fromString(typeDefs[0].split(":")[0])){
						return api;
					}
				}

				// Check, types length != function parameters length
				if (typeDefs.length !== f.length) {
					throw "jsface.def: Invalid method declaration for " + methodName + "() at overloading \"" + key +
						"\". Actual overloading parameters do not match with their types declaration.";
				}

				// Prepare overloadingsMeta[] for this function
				if (overloadingsMeta[typeDefs.length] === undefined) {
					overloadingsMeta[typeDefs.length] = [];
				}

				// Transform typeDefs from array of string to array of object
				typeDefs = transformTypes(typeDefs, key);

				// Put method info (type declaration and function) into overloadingsMeta
				overloadingsMeta[typeDefs.length].push({
					types: typeDefs,
					fn: f
				});
			}

			// Make wrapper
			return function(overloadings) {
				return function() {
					var len = arguments.length;

					if (overloadings[len] !== undefined) {         // Match, delegate to selectHandler
						return selectHandler(this, overloadings[len], len, arguments);
					} else if (overloadings[0] !== undefined) {    // Default handler
						return overloadings[0][0].fn.apply(this, arguments);
					} else {                                       // No one matched, throw an exception
						throw methodName + "() does not accept " + len + " arguments";
					}
				};
			}(overloadingsMeta);
		}

		return function(methodName, api) {
			if (jsface.isArray(api)) {                          // API as an array
				return makeOverloadingArray(methodName, api);
			} else if (jsface.isMap(api)) {                     // API as an object
				return makeOverloadingObject(methodName, api);
			} else {                                            // Default, not a method, return as is
				return api;
			}
		};
	}(),

	/**
	 * Define a class. If a class exists, it will be replaced.
	 *
	 * @param {Object} opts class options.
	 * @return {Class} class structure.
	 */
	def: function() {
		/*
		 * Check class parameters.
		 * @param {Map} params class declaration parameters.
		 */
		function defCheck(params) {
			if ( !jsface.isMap(params)) {
				throw "jsface.def: Class parameters must be a map object";
			}
			if ( !jsface.isMap(params.$meta)) {
				throw "jsface.def: Invalid parameter $meta, must be a map";
			}
			if ( !jsface.isString(params.$meta.name)) {
				throw "jsface.def: Class name is not valid string";
			} else if ( !jsface.isIdentifier(params.$meta.name)) {
				throw "jsface.def: Class name " + params.$meta.name + " is not valid identifier";
			}
		}

		return function(opts) {
			var $meta, clazz, bindTo, ignoredKeys = { $meta: 1 }, parent;

			// Check parameters for errors
			defCheck(opts);

			// Collect ignored keys in jsface.def.plugins (skip to copy to actual class)
			jsface.each(jsface.def.plugins, function(key) {
				ignoredKeys[key] = 1;
			});

			$meta = opts.$meta;                // fast shortcut
			ignoredKeys[$meta.name] = 1;       // ignore $meta and constructor

			if ($meta.singleton === true) {    // a singleton class
				clazz = {};                    // initial class structure of a singleton is a map
				bindTo = clazz;
			} else {
				clazz = opts[$meta.name] ? jsface.overload($meta.name, opts[$meta.name]) : function() {};
				clazz.$meta = $meta;
				bindTo = clazz.prototype;
			}

			// Inherit APIs from parent
			parent = jsface.isArray(parent) ? $meta.parent : [ $meta.parent ];

			jsface.each(parent, function(item) {
				jsface.inherit(clazz, item);
			});

			// Loop over opts, copy all methods/properties which are not in ignoredKeys
			jsface.each(opts, function(key, value) {
				if (ignoredKeys[key]) {
					return;
				}
				bindTo[key] = jsface.overload($meta.name + "." + key, value);
			});

			// Bind clazz to namespace if it exists, otherwise, make the class global
			if ($meta.namespace) {
				if (jsface.isString($meta.namespace)) {
					jsface.namespace($meta.namespace)[$meta.name] = clazz;
				} else {
					$meta.namespace[$meta.name] = clazz;
				}
			} else {
				jsface.global($meta.name, clazz);
			}

			// Pass control to plugins
			jsface.each(jsface.def.plugins, function(name, fn) {
				fn(clazz, opts);
			});
			return clazz;
		};
	}(),

	/**
	 *
	 * Wrapper a function with before, after functions around it.
	 * @param {Function} fn original function.
	 * @param {Function} before
	 * @param {Function} after
	 * @param {Boolean} seq sequential mode (true) or curly mode (other).
	 */
	wrap: function(fn, before, after, seq) {
		var ignoredKeys = { $meta: 1, prototype: 1 },
			closure = function() {
			// sequential mode. fn = before();r = fn();after();return r;
			if (seq === true) {
				// Invoke before, if it returns false, skip fn() and after()
				if (before.apply(this, arguments) === false) {
					return;
				}

				// Invoke fn, save return value
				var ret = fn.apply(this, arguments);

				// Invoke after()
				after.apply(this, arguments);

				// Return ret
				return ret;
			} else { // curly mode. fn = after(fn(before()))
				return after.apply(this, [fn.apply(this, [before.apply(this, arguments)])]);
			}
		};

		// Wrap fn but keep its properties
		jsface.each(fn, function(key, value) {
			if ( !ignoredKeys[key]) {
				closure[key] = value;
			}
		});
		return closure;
	},

	/**
	 * Apply Aspect Oriented Programming into a class.
	 * @param {Object} clazz pointcuts subject.
	 * @param {Object} opts pointcuts API.
	 */
	pointcuts: function(clazz, opts) {
		if (jsface.isEmpty(clazz) || jsface.isEmpty(opts)) {
			throw "jsface.pointcuts: Invalid parameters.";
		}

		var	isClass = jsface.isFunction(clazz),
			isInstance = !isClass,
			bindTo = isClass ? clazz.prototype : clazz;

		jsface.each(opts, function(method, pointcuts) {
			var	seq = ((pointcuts.seq === false) ? false : true),  // default seq is true
				before = (pointcuts.before || jsface.noop),
				after = (pointcuts.after || jsface.noop);

			// Checking
			if ( !jsface.isFunction(before)) {
				throw "jsface.pointcuts: Invalid " + method + ".before() pointcut. Must be a function";
			}
			if ( !jsface.isFunction(after)) {
				throw "jsface.pointcuts: Invalid " + method + ".after() pointcut. Must be a function";
			}

			if (isInstance) {
				if (jsface.isFunction(bindTo[method])) {
					bindTo[method] = jsface.wrap(bindTo[method], before, after, seq);
				} else {
					throw "jsface.pointcuts: " + method + " is not a function, cannot be pointcut";
				}
			} else {
				if (jsface.isMap(clazz.$meta) && jsface.isIdentifier(clazz.$meta.name) && method === clazz.$meta.name) {
					//  Backup prototype
					var proto = clazz.prototype, cls = clazz,                  // cls: backup
						constructor = jsface.wrap(clazz, before, after, seq);  // new constructor

					// Restore prototype, no data lost
					if (clazz.$meta.namespace) {
						clazz = clazz.$meta.namespace[method] = constructor;
					} else {
						clazz = jsface.global(method, constructor);
					}

					clazz.prototype = proto;
					clazz.prototype.constructor = constructor;

					// Re-bind static properties, except prototype
					jsface.each(cls, function(property, value) {
						if (property !== "prototype") {
							clazz[property] = value;
						}
					});
				} else {
					if (jsface.isFunction(bindTo[method])) {
						bindTo[method] = jsface.wrap(bindTo[method], before, after, seq);

						// Also is a static function? Update static pointer
						if (jsface.isFunction(clazz[method])) {
							clazz[method] = bindTo[method];
						}
					} else {
						throw "jsface.pointcuts: " + method + " is not a function, cannot be pointcut";
					}
				}
			}
		});
	},

	/**
	 * Inherit properties from an object.
	 * @param {Class/Object} subject inherit subject (child).
	 * @param {Class/Object} object where properties come out (parent).
	 */
	inherit: function(subject, object) {
		var ignoredKeys = { $meta: 1, prototype: 1 }, bindTo, isClass;

		// Quitely quit if subject or object is empty
		if (jsface.isNullOrUndefined(subject) || jsface.isEmpty(object)) {
			return;
		}

		if (jsface.isArray(object)) {
			jsface.each(object, function(obj) {
				jsface.inherit(subject, obj);
			});
		}

		bindTo = jsface.isClass(subject) ? subject.prototype : subject;

		// Loop over static properties of object
		jsface.each(object, function(key, value) {
			if ( !ignoredKeys[key]) {
				bindTo[key] = value;
			}
		});

		// If object is a class, plug its prototype.* properties also
		if (jsface.isClass(object)) {
			jsface.each(object.prototype, function(key, value) {
				if ( !ignoredKeys[key]) {
					bindTo[key] = value;
				}
			});
		}
	},

	/**
	 * Profiling a subject.
	 * @param {Class/Object} subject subject to profiling.
	 * @param {Map} repository where to save profiling result.
	 */
	profiling: function(subject, repository) {
		// Util function to make a pointcut data structure
		function makeOne(name, repository) {
			return {
				before: function() {
					repository[name] = (repository[name] || {});
					if (repository[name].begin) {
						repository[name].begin.push(new Date());
					} else {
						repository[name].begin = [ new Date() ];
					}
				},
				after: function() {
					repository[name].count = (repository[name].count || 0) + 1;
					var begin = repository[name].begin.pop();
					repository[name].time = (repository[name].time || 0) + (new Date() - begin);
					if ( !repository[name].begin.length) {
						delete repository[name].begin;
					}
				}
			};
		}

		// Util function to make pointcuts data structure for the whole subject
		function makePointcuts(subject, repository) {
			var pointcuts = {}, sub = subject, name;

			if (jsface.isClass(subject)) {
				sub = subject.prototype;
				if (subject.$meta && subject.$meta.name) {
					name = subject.$meta.name;
					pointcuts[subject.$meta.name] = makeOne(name, repository);
				}
			}
			jsface.each(sub, function(key, fn) {
				if (jsface.isFunction(fn)) {
					pointcuts[key] = makeOne(key, repository);
				}
			});
			return pointcuts;
		}

		// Rebind jsface.profiling
		jsface.profiling = function profile(subject, repository) {
			if ( !jsface.isMap(repository)) {
				throw "jsface.profile: profiling repository must be a map/object";
			}
			// Simply invoke jsface.pointcuts
			jsface.pointcuts(subject, makePointcuts(subject, repository));
		};
		return jsface.profiling(subject, repository);
	}
};

/**
 * jsface.def()'s plugins. The repository for jsface.def()'s processing plugins.
 */
jsface.def.plugins = {
	/*
	 * Plug-in: statics.
	 * Purpose: Making static methods/properties. They are available in both class and instance
	 * levels. I.e: Both jsface.Element.get() and jsface.Element element.get() are valid.
	 */
	statics: function(clazz, opts) {
		if ( !opts.$meta.singleton) {
			jsface.each(opts.$meta.statics, function(fnName) {
				if (jsface.isIdentifier(fnName) && opts[fnName]) {
					clazz[fnName] = opts[fnName];
				} else {
					throw "jsface.def: Invalid static method/property " + fnName + " in declaring class " + opts.$meta.name;
				}
			});
		}
	},

	/*
	 * Plug-in: ready
	 * Purpose: Class level initialization.
	 */
	ready: function(clazz, opts) {
		if (jsface.isFunction(opts.$meta.ready)) {
			opts.$meta.ready(clazz, opts);
			delete opts.$meta.ready;
		}
	},

	/*
	 * Plug-in: pointcuts.
	 * Purpose: Support Aspect Oriented Programming in def().
	 */
	pointcuts: function(clazz, opts) {
		if (jsface.isMap(opts.$meta.pointcuts)) {
			jsface.pointcuts(clazz, opts.$meta.pointcuts);
		}
	}
};

// Make jsface available on global scope
jsface.global("jsface", jsface);

})();
