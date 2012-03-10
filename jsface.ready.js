/*
 * JSFace Object Oriented Programming Library - Ready plugin
 * https://github.com/tannhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tannhu/jsface/blob/master/MIT-LICENSE.txt)
 * Version: 1.0.0
 */
(function(context) {
  var jsface     = context.jsface || require("./jsface"),
      each       = jsface.each,
      Class      = jsface.Class,
      isFunction = jsface.isFunction,
      readyFns   = [];

  Class.plugins.$ready = function(clazz, parent, api) {
    var r = api.$ready, count = 0, len = parent ? parent.length : 0;

    // in an environment where there are a lot of class creating/removing (rarely)
    // this implementation might cause a leak (saving pointers to clazz and $ready)
    each(readyFns, function(entry) {
      return each(parent, function(pa) {
        if (pa === entry[0]) {
          entry[1].call(pa, clazz, api, parent);
        }
        if (count++ >= len ) { return Infinity; }
      });
    });

    if (isFunction(r)) {
      r.call(clazz, clazz, api, parent);
      readyFns.push([ clazz,  r ]);
    }
  };
})(this);
