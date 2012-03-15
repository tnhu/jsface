/*
 * JSFace Object Oriented Programming Library
 * https://github.com/tannhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tannhu/jsface/blob/master/MIT-LICENSE.txt)
 * Version: 2.0.3
 */
(function(context, OBJECT, NUMBER, LENGTH, INVALID, undefined, oldClass, jsface) {
  /**
   * Check an object is a map or not. A map is something like { key1: value1, key2: value2 }.
   */
  function isMap(obj) {
    return (obj && typeof obj === OBJECT && !(typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH))));
  }

  /**
   * Check an object is an array or not. An array is something like [].
   */
  function isArray(obj) {
    return (obj && typeof obj === OBJECT && typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH)));
  }

  /**
   * Check an object is a function or not.
   */
  function isFunction(obj) {
    return (obj && typeof obj === "function");
  }

  /**
   * Check an object is a string not.
   */
  function isString(obj) {
    return Object.prototype.toString.apply(obj) === "[object String]";
  }

  /**
   * Check an object is a class (not an instance of a class, which is a map) or not.
   */
  function isClass(clazz) {
    return isFunction(clazz) && (clazz.prototype && clazz === clazz.prototype.constructor);
  }

  /**
   * Loop over a collection (a string, an array, an object (a map with pairs of {key:value})), or a function (over all
   * static properties).
   * Over a String or Array, fn is executed as: fn(value, index, collection) Otherwise: fn(key, value, collection).
   * Return Infinity (1/0) on fn will stop the iteration. each returns an array of results returned by fn.
   */
  function each(collection, fn) {
    var iArray, iMap, iString, iFunction, item, i, r, v, len, result = [];

    if ( !collection || !fn) { return; }

    iString   = isString(collection);
    iArray    = isArray(collection) || iString;
    iMap      = isMap(collection);
    iFunction = isFunction(collection);

    // convert to array if collection is not a collection itself
    if ( !iArray && !iMap && !iFunction) {
      collection = [ collection ];
      iArray     = 1;
    }

    if (iArray) {
      for (i = 0, len = collection.length; i < len;) {
        v = iString ? collection.charAt(i) : collection[i];
        if ((r = fn(v, i++, collection)) === 1/0) { break; }
        result.push(r);
      }
    } else {
      for (item in collection) {
        if ((r = fn(item, collection[item], collection)) === 1/0) { break; }
        result.push(r);
      }
    }
    return result;
  }

  /**
   * Make $super method.
   */
  function makeSuper(child, parent) {
    parent = parent && parent[0];

    var iClass = isClass(parent), proto = child.prototype, __super;

    if (parent) {
      each(proto, function(fnName, fn) {
        __super = fnName !== "$super" && isFunction(fn) && ( (iClass && isFunction(parent.prototype[fnName]) && parent.prototype[fnName]) || (!iClass && isFunction(parent[fnName]) && parent[fnName]));
        if (__super) {
          fn.__super = __super;
        }
      });

      child.$super  = parent;
      child.__super = parent;
      child.$superp = iClass ? parent.prototype : parent;
    }

    proto.$super = function $super() {
      var __super = $super.caller.__super;                                   // VERY EXPENSIVE!!!
      return __super && __super.apply(this, arguments);
    };
  }

  /**
   * Extend an object.
   */
  function extend(object, subject, ignoredKeys, skipPrototype) {
    if (isArray(subject)) {
      return each(subject, function(sub) {
        extend(object, sub, ignoredKeys, skipPrototype);
      });
    }

    ignoredKeys = ignoredKeys || { constructor: 1, $super: 1, prototype: 1 };

    var iClass     = isClass(object),
        isSubClass = isClass(subject),
        oPrototype = object.prototype, supez;

    function copier(key, value) {
      if ( !ignoredKeys || !ignoredKeys.hasOwnProperty(key)) {    // no copy ignored keys
        object[key] = value;                                      // do copy
        if (iClass) { oPrototype[key] = value; }                  // class? copy to prototype as well
      }
    }

    // copy static properties and prototype.* to object
    if (isMap(subject)) { each(subject, copier); }
    if (isSubClass && !skipPrototype) { each(subject.prototype, copier); }

    // second: prototype properties
    if (iClass && isSubClass) {
      extend(oPrototype, subject.prototype, ignoredKeys, skipPrototype);
    }
  }

  /**
   * Create a class.
   */
  function Class(parent, api) {
    if ( !api) { parent = (api = parent, 0); }
    api = api || {};

    var clazz, constructor, singleton, statics,
        ignoredKeys = { constructor: 1, $singleton: 1, $statics: 1, prototype: 1 },
        overload    = Class.overload || function(name, fn){ return fn; };

    parent = (parent && !isArray(parent)) ? [ parent ] : parent;             // convert to array
    api    = isFunction(api) ? api() : api;                                  // execute api if it's a function
    if ( !isMap(api)) { throw INVALID; }

    constructor = api.hasOwnProperty("constructor") ? api.constructor : 0;   // hasOwnProperty is a must, constructor is special
    singleton   = api.$singleton;
    statics     = api.$statics;

    each(Class.plugins, function(key) { ignoredKeys[key] = 1; });            // add plugins' keys into ignoredKeys

    clazz = singleton ? {} : (constructor ? overload("constructor", constructor) : function(){});

    each(parent, function(p) {                                               // extend parent static properties
      extend(clazz, p, ignoredKeys, 1);
    });
    extend(singleton ? clazz : clazz.prototype, api, ignoredKeys);           // extend api
    extend(clazz, statics, ignoredKeys);                                     // extend static properties

    if ( !singleton) { makeSuper(clazz, parent); }                           // make $super (no singleton support)
    each(Class.plugins, function(name, fn) { fn(clazz, parent, api); });     // pass control to plugins
    return clazz;
  }

  /* Class plugins repository */
  Class.plugins = {};

  /* Initialization */
  jsface = {
    Class     : Class,
    extend    : extend,
    each      : each,
    isMap     : isMap,
    isArray   : isArray,
    isFunction: isFunction,
    isString  : isString,
    isClass   : isClass
  };

  if (typeof module !== "undefined" && module.exports) { // NodeJS/CommonJS
    module.exports = jsface;
  } else {
    oldClass          = context.Class;                   // save current Class namespace
    context.Class     = Class;                           // bind Class and jsface to global scope
    context.jsface    = jsface;
    jsface.noConflict = function() {                     // no conflict
      context.Class   = oldClass;
    }
  }
})(this, "object", "number", "length", "Invalid params");
