/*
 * JSFace Object Oriented Programming Library
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 */
(function(context, OBJECT, NUMBER, LENGTH, toString, undefined, oldClass, jsface) {
  "use strict";

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
    return toString.apply(obj) === "[object String]";
  }

  /**
   * Check an object is a class (not an instance of a class, which is a map) or not.
   */
  function isClass(clazz) {
    return isFunction(clazz) && (clazz.prototype && clazz === clazz.prototype.constructor);
  }

  /**
   * Extend object from subject, ignore properties in ignoredKeys
   */
  function extend(object, subject, ignoredKeys) {
    function copier(key, value) {
      if ( !ignoredKeys || !ignoredKeys.hasOwnProperty(key)) {    // no copy ignored keys
        object[key] = value;                                      // do copy
        if (iClass) { oPrototype[key] = value; }                  // class? copy to prototype as well
      }
    }

    if (isArray(subject)) {
      for (var len = subject.length; --len >= 0;) { extend(object, subject[len], ignoredKeys); }
    } else {
      ignoredKeys = ignoredKeys || { constructor: 1, $super: 1, prototype: 1, $superb: 1 };

      var iClass     = isClass(object),
          isSubClass = isClass(subject),
          oPrototype = object.prototype, supez, key, proto;

      // copy static properties and prototype.* to object
      if (isMap(subject)) { for (key in subject) copier(key, subject[key]); }

      if (isSubClass) {
        proto = subject.prototype;
        for (key in proto) { copier(key, proto[key]); }
      }

      // prototype properties
      if (iClass && isSubClass) { extend(oPrototype, subject.prototype, ignoredKeys); }
    }
  }

  /**
   * Create a class.
   */
  function Class(parent, api) {
    if ( !api) parent = (api = parent, 0);

    var clazz, constructor, singleton, statics, key, bindTo, len, i = 0, p,
        ignoredKeys = { constructor: 1, $singleton: 1, $statics: 1, prototype: 1, $super: 1, $superp: 1, main: 1 },
        overload    = Class.overload,
        plugins     = Class.plugins;

    api         = (typeof api === "function" ? api() : api) || {};                                 // execute api if it's a function
    constructor = api.hasOwnProperty("constructor") ? api.constructor : 0;                         // hasOwnProperty is a must, constructor is special
    singleton   = api.$singleton;
    statics     = api.$statics;

    for (key in plugins) { ignoredKeys[key] = 1; }                                                 // add plugins' keys into ignoredKeys

    clazz  = singleton ? {} : (constructor ? (overload ? overload("constructor", constructor) : constructor) : function(){});
    bindTo = singleton ? clazz : clazz.prototype;

    parent = !parent || isArray(parent) ? parent : [ parent ];
    len = parent && parent.length;
    while (i < len) {
      p = parent[i++];
      for (key in p) {
        if ( !ignoredKeys[key]) {
          bindTo[key] = p[key];
          if ( !singleton) { clazz[key] = p[key]; }
        }
      }
      for (key in p.prototype) {
        if ( !ignoredKeys[key]) { bindTo[key] = p.prototype[key]; }
      }
    }

    for (key in api) {
      if ( !ignoredKeys[key]) bindTo[key] = api[key];
    }
    for (key in statics) {
      clazz[key] = bindTo[key] = statics[key];
    }

    if ( !singleton) {
      p = parent && parent[0] || parent;
      clazz.$super  = p;
      clazz.$superp = p && p.prototype ? p.prototype : p;
    }

    for (key in plugins) { plugins[key](clazz, parent, api); }                                     // pass control to plugins
    if (isFunction(api.main)) { api.main.call(clazz, clazz); }                                     // execute main()

    return clazz;
  }

  /* Class plugins repository */
  Class.plugins = {};

  /* Initialization */
  jsface = {
    Class     : Class,
    extend    : extend,
    isMap     : isMap,
    isArray   : isArray,
    isFunction: isFunction,
    isString  : isString,
    isClass   : isClass
  };

  if (typeof module !== "undefined" && module.exports) {                                           // NodeJS/CommonJS
    module.exports = jsface;
  } else {
    oldClass          = context.Class;                                                             // save current Class namespace
    context.Class     = Class;                                                                     // bind Class and jsface to global scope
    context.jsface    = jsface;
    jsface.noConflict = function() { context.Class   = oldClass; }                                 // no conflict
  }
})(this, "object", "number", "length", Object.prototype.toString);
