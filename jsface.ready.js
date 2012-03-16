/*
 * JSFace Object Oriented Programming Library - Ready plugin
 * https://github.com/tannhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tannhu/jsface/blob/master/MIT-LICENSE.txt)
 * Version: 2.1.0
 */
(function(context) {
  "use strict";

  var jsface     = context.jsface || require("./jsface"),
      Class      = jsface.Class,
      isFunction = jsface.isFunction,
      readyFns   = [];

  Class.plugins.$ready = function(clazz, parent, api) {
    var r = api.$ready, count = 0, len = parent ? parent.length : 0, pa, entry;

    // in an environment where there are a lot of class creating/removing (rarely)
    // this implementation might cause a leak (saving pointers to clazz and $ready)
    for (entry in readyFns) {
      while (len--) {
        pa = parent[len];
        if (pa === entry[0]) {
          entry[1].call(pa, clazz, api, parent);
        }
        if (count++ >= len ) {
          count = false;
          break;
        }
      }
      if ( !count) { break; }
    }

    if (isFunction(r)) {
      r.call(clazz, clazz, api, parent);
      readyFns.push([ clazz,  r ]);
    }
  };
})(this);
