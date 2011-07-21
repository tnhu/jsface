/*
 * jsFace JavaScript Object Oriented Programming Library
 *
 * https://github.com/tannhu/jsface
 *
 * Copyright (c) 2010 Tan Nhu
 * Dual licensed under the MIT and GPL version 2 licenses.
 * $Date: Saturday, March 07 2009 $
 */
(function(globalContext) {
   var jsface = {
       version: "1.2",

      /**
       * Create a namespace hierarchy. If one namespace in chain exists, it will be reused.
       * @param {String} namespace
       * @return null if namespace is invalid. otherwise, return the namespace object.
       * Example: var ns = jsface.namespace("com.jsface.widgets"); // ns becomes com.jsface.widgets
       */
      namespace: function(namespace) {
         if (jsface.isString(namespace)) {
            var names = namespace.split("."), len = names.length, i,
                root  = globalContext[names[0]] ? globalContext[names[0]] : (globalContext[names[0]] = {});

            // Check each name using regular expression
            // Condition: Begin with an alphabet character, follow by alphabets or numbers
            for (i = 0; i < len; i++) {
               if ( !jsface.isIdentifier(names[i])) {
                  throw names[i] + " is not a valid namespace alias";
               }
            }

            for (i = 1; i < len; i++) {
               root[names[i]] = root[names[i]] ? root[names[i]] : {};
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

         isArray    = jsface.isArray(collection) || jsface.isString(collection);
         isMap      = jsface.isMap(collection);
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
         return /^[a-zA-Z_$]+[0-9a-zA-Z_$]*$/.test(id);
      },

      /**
       * Define a class. If a class exists, it will be replaced.
       *
       * @param {Object} opts class options.
       * @return {Class} class structure.
       */
      def: function() {
         /*
          * Normalize parameters.
          * @param {Map} params class declaration parameters.
          */
         function normalize(params) {
            var name;
            
            if ( !jsface.isMap(params)) {
               throw "jsface.def: Class parameters must be a map object";
            }
            if ( !jsface.isMap(params.$meta)) {
               throw "jsface.def: Invalid parameter $meta, must be a map";
            }
            if ( !jsface.isString(params.$meta.name)) {
               throw "jsface.def: Class name is not valid string";
            } else if ( !jsface.isIdentifier(params.$meta.name)) {
               try {
                  // support specifying namespace in class name, i.e: jsface.def("com.abc.Foo")
                  name                   = params.$meta.name.split(".");
                  params.$meta.name      = name.pop();
                  params.$meta.namespace = jsface.namespace(name.join("."));
               } catch (e) {
                  throw "jsface.def: Class name " + params.$meta.name + " is not valid identifier";                  
               }
            }
         }

         return function() {
            var $meta, clazz, bindTo, ignoredKeys = { $meta: 1 }, parent, opts;
            
            // support overloadings def(className, opts) and def(className, parent, opts)
            switch (arguments.length) {
               case 1: // def(opts)
                  opts = arguments[0];
                  break;
               case 2: // def(className, opts)
                  opts            = arguments[1];
                  opts.$meta      = opts.$meta || {};
                  opts.$meta.name = arguments[0];
                  break;
               case 3: // def(className, parent, opts)
                  opts              = arguments[2]
                  opts.$meta        = opts.$meta || {};
                  opts.$meta.name   = arguments[0];
                  opts.$meta.parent = arguments[1];
                  break;
            }
  
            // normalize parameters
            normalize(opts);

            // Collect ignored keys in jsface.def.plugins (skip to copy to actual class)
            jsface.each(jsface.def.plugins, function(key) {
               ignoredKeys[key] = 1;
            });

            $meta = opts.$meta;                // fast shortcut
            ignoredKeys[$meta.name] = 1;       // ignore $meta and constructor

            if ($meta.singleton === true) {    // a singleton class
               clazz  = {};                    // initial class structure of a singleton is a map
               bindTo = clazz;
               clazz.name  = $meta.name;
               clazz.$meta = $meta;
            } else {
               clazz       = opts[$meta.name] ? /*jsface.overload($meta.name, opts[$meta.name])*/opts[$meta.name] : function() {};
               clazz.name  = $meta.name;
               clazz.$meta = $meta;
               bindTo      = clazz.prototype;
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
               bindTo[key] = value;//jsface.overload($meta.name + "." + key, value);

               // add function name into function (make it easier for debugging)
               if (jsface.isFunction(bindTo[key])) {
                  bindTo[key].name = key;
               }
            });

            // Bind clazz to namespace if it exists, otherwise, make the class global
            if ($meta.namespace) {
               if (jsface.isString($meta.namespace)) {
                  jsface.namespace($meta.namespace)[$meta.name] = clazz;
               } else {
                  $meta.namespace[$meta.name] = clazz;
               }
            } else {
               globalContext[$meta.name] = clazz;
            }

            // Pass control to plugins
            jsface.each(jsface.def.plugins, function(name, fn) {
               fn(clazz, opts);
            });
            return clazz;
         };
      }(),

      /**
       * Inherit properties from an object.
       * @param {Class/Object} child sub-class.
       * @param {Class/Object} parent super class.
       */
      inherit: function(child, parent) {
         var ignoredKeys = { $meta: 1, prototype: 1 }, bindTo, isClass;

         // Quitely quit if child or parent is empty
         if ( !child || !parent) {
            return;
         }

         if (jsface.isArray(parent)) {
            jsface.each(parent, function(obj) {
               jsface.inherit(child, obj);
            });
         }

         bindTo = jsface.isClass(child) ? child.prototype : child;

         // Loop over static properties of object
         jsface.each(parent, function(key, value) {
            if ( !ignoredKeys[key]) {
               if (parent.hasOwnProperty(key) && !(jsface.isClass(parent) && key === "name")) {
                  bindTo[key] = value;                  
               }
            }
         });

         // If object is a class, plug its prototype.* properties also
         if (jsface.isClass(parent)) {
            jsface.each(parent.prototype, function(key, value) {
               if ( !ignoredKeys[key]) {
                  bindTo[key] = value;
               }
            });
         }
      },

		/**
		 * Execute ready funtions in inheritance hierarchy. 
		*/
		fireParentReady: function(clazz, opts) {
			var entries = [], entry;
			
			function collectReady(p) {
				var parent;
				
				if (jsface.isArray(p)) {
					jsface.each(p, function(pa) {
						collectReady(pa);
					});
				}
				
				if (p && p.$meta) {
					if (p.$meta.ready) {
						entries.push({ clazz: p, ready: p.$meta.ready });
					}
				
					if (parent = p.$meta.parent) {
						parent = jsface.isArray(parent) ? parent : [parent];
				
						jsface.each(parent, function(pa) {
							collectReady(pa);
						});
					}
				}
			}
			
			collectReady(opts.$meta.parent);
			
			while (entries.length) {
				entry = entries.pop();
				entry.ready.call(entry.clazz, clazz, opts);
			}
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
         // ready functions are inherited
         jsface.fireParentReady(clazz, opts);
         
         if (jsface.isFunction(opts.$meta.ready)) {
            opts.$meta.ready.call(clazz, clazz, opts);
         }
      }
   };

	// Bind jsface to global context
   globalContext.jsface = jsface;
})(this);