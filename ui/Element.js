/*
 * jsface.ui.Element
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 * Version: 2.1.0
 */
(function() {
  var jsface = this.jsface || require("./jsface"),
      ui     = jsface.ui;

  ui.Element = jsface.Class({
    constructor: function(e) {
      this.e = e;
    },

    attr: function(name, value) {
      if (name && value) {
        // ...
        return this;
      }
    },

    css: function() {
    },

    addClass: function() {
    }.

    hasClass: function() {
    },

    removeClass: function() {
    },

    offset: function() {
    },

    children: function() {
    },

    next: function(){
    },

    prev: function() {
    },

    siblings: function() {
    }.

    parent: function() {
    },

    find: function() {
    }
  });
})();
