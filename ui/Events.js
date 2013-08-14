/*
 * jsface.ui.Events - Fast and simple UI events manager
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2012 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 * Version: 2.1.0
 */
(function() {
  var win             = this,                              // aliases
      jsface          = win.jsface,
      ui              = jsface.ui,
      Element         = ui.Element,
      env             = ui.env,
      touch           = env.touch,
      MsgBus          = jsface.MsgBus,
      bind            = ui.bind,
      on              = MsgBus.on,
      fire            = MsgBus.fire,
      doc             = document,
      documentElement = doc.documentElement,
      documentBody    = doc.body,
      CLICK           = "ui.click",                        // event type constants
      TOUCH_START     = "ui.touchstart",
      TOUCH_END       = "ui.touchend",
      READY           = "ui.ready",
      RESIZE          = "ui.resize",
      SCROLL          = "ui.scroll";

  ui.Events = jsface.Class({
    $singleton        : true,

    /**
     * Event types
     */
    CLICK             : CLICK,                             // pointers to private properties (accessing private properties in methods is faster than this.*)
    TOUCH_START       : TOUCH_START,
    TOUCH_END         : TOUCH_END,
    READY             : READY,
    RESIZE            : RESIZE,
    SCROLL            : SCROLL,

    /**
     * Bind a callback to window resize event. Callback will be notified as callback(data)
     * in which data contains standardized environment information.
     * @param Function callback callback
     */
    resize: function(callback) {
      bind(doc, "resize", function() {
        var data = {      // calculate dimention, pageOffset, etc...
              pageX: 0,
              pageY: 0,
              winX: 0,
              winY: 0
            };
        fire(RESIZE, data);
      });

      this.resize = function(cb) {
        on(RESIZE, cb);
        return this;
      };

      return this.resize(callback);
    },

    /**
     * Bind a callback to document ready event. Callback will be notified as callback(jsface.ui.env). If
     * document is already ready, callback is notified immediately.
     * @param Function callback callback
     */
    ready: function(callback) {
      bind(doc, "ready", function() {
        fire(READY, env).off(READY);                                           // when ready is done: wipe out the event
      });

      this.ready = function(cb) {
        if (doc.body) {
          cb(env);
        } else {
          on(READY, cb);
        }
        return this;
      };

      return this.ready(callback);
    },

    /**
     * Bind a callback to window scroll event. Callback will be notified as callback(data) in which data contains
     * standardized environment information.
     * @param Function callback callback
     */
    scroll: function(callback) {
      var pageOffset = win.pageYOffset || documentElement.scrollTop || documentBody.scrollTop;
        on(SCROLL, callback);
    },

    /**
     * Bind a callback to click event on document. In touch devices, click will be translated as
     * touchend. Callback will be notified as callback(jsface.ui.Element)
     * @param Function callback callback
     */
    click: function(callback) {
      if ( !touch) {
        bind(doc, "click", function(e) {
          fire(CLICK, new Element(e)); // TODO need caching ???
        });
      }

      this.click = touch ? this.touchEnd : function(cb) {              // click = touchEnd in touch devices
        on(CLICK, cb);
        return this;
      };

      return this.click(callback);
    },

    /**
     * Bind a callback to mousedown event on document. In touch devices, mousedown will be translated as
     * touchstart. Callback will be notified as callback(jsface.ui.Element)
     * @param Function callback callback
     */
    mouseDown: function(callback) {
    },

    /**
     * Bind a callback to mouseup event on document. In touch devices, mouseup will be translated as
     * touchend. Callback will be notified as callback(jsface.ui.Element)
     * @param Function callback callback
     */
    mouseUp: function(callback) {
    },

    /**
     * Bind a callback to touchstart. Callback will be notified as callback(jsface.ui.Element)
     * @param Function callback callback
     */
    touchStart: function(selector, callback) {
      on(TOUCH_START, callback);
    },

    /**
     * Bind a callback to touchend. Callback will be notified as callback(jsface.ui.Element)
     * touchstart. Callback will be notified as callback(jsface.ui.Element)
     * @param Function callback callback
     */
    touchEnd: function(selector, callback) {
      on(TOUCH_END, callback);
    }
  });
})();

/*
pre("YDom.{hasClass,setStyle,getStyle,getXY};");

"@import YDom.{hasClass,setStyle,getStyle,getXY};"

/*@ import YDom.{hasClass,setStyle,getStyle,getXY} */

/*
ui.Events.act("a.foo", function(e) {});
ui.Events.act("#home", function(e) {});
ui.Events.act("li.card a.bt-ok", function(e) {});

new ui.Handler(document.body, {
  onBtOk: function(e) {
  },
  act: {
    "a.bt-primary": function(e) {
    }
  }
});

ui.Events.act("a", function(e) {
  e.addClass("foo bar);
  e.css("height", "100px");
  e.attr("title");
  e.attr("href", "http://www.foobar.com");
});

act: function(selector, callback) {
  var elements = Sizzle(selector)

  foreach (e : elements) {
    attr(e, "data-selector", selector)
  }

  eventCallbacks[selector] = callback;
}

delegate:

  target
  selector = attr(target, "data-selector")

  if (selector)
    eventCallbacks[selector].call(...)

  else

    ... may be appended later (live)

*/
