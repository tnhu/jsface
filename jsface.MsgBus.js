/*
 * jsface.MsgBus - Simple message bus
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 * Version: 2.1.0
 */
(function() {
  var repository = {},
      slice      = Array.prototype.slice,
      jsface     = this.jsface || require("jsface"),
      BROADCAST  = "sys.broadcast";

  jsface.MsgBus = jsface.Class({
    $singleton: true,
    repo      : repository,
    broadcast : false,

    /**
     * Bind a callback into an event.
     * @param String type event type.
     * @param Function callback listener.
     * @param Object context context when executing callback (optional, default is this)
     */
    on: function(type, callback, context) {
      var item, len, ct = context || this;

      item = (repository[type] = repository[type] || []);

      // no duplication
      len  = item.length;
      while (len--) {
        if (item[len].cb === callback && item[len].ct === ct) {
          return this;
        }
      }

      item.push({ ct: ct, cb: callback });
      return this;
    },

    /**
     * Bind a callback to system broadcast event
     * @param callback listener
     */
    sys: function(callback) {
      return this.on(BROADCAST, callback);
    },

    /**
     * Reset Message Service
     */
    reset: function() {
      for (var key in repository) {              // better than repository = {} in terms of garbage collection
        if (repository.hasOwnProperty(key)) {    // but much slower (as this api is seldom called)
          delete repository[key];
        }
      }
      this.broadcast = false;
      return this;
    },

    /**
     * Unbind a callback from an event.
     * @param String type event type.
     * @param Function callback listener (optional). If callback is not passed, all listeners will be removed
     */
    off: function(type, callback) {
      var item = repository[type],
          len  = item && item.length || 0;

      while (len--) {
        if (item[len].cb === callback) {
          item.splice(len, 1);
        } else if ( !callback) {                 // invoke off without callback: remove all callbacks
          delete repository[type];
          break;
        }
      }
      return this;
    },

    /**
     * Fire an event.
     * @param String type event type.
     * @param Object arg... arguments passed to listeners
     */
    fire: function() {
      var args = [].concat(slice.apply(arguments)),
          type = args.shift(),
          item = repository[type],
          len  = item && item.length || 0,
          i    = 0;

      while (i < len) {
        item[i].cb.apply(item[i++].ct, args);
      }

      if (this.broadcast) {
        this.broadcast = false;
        this.fire.apply(this, [ BROADCAST, type ].concat(args));
        this.broadcast = true;
      }
      return this;
    }
  });

  // CommonJS support
  ("undefined" !== typeof module) && module.exports && (module.exports = jsface.MsgBus);
})();
