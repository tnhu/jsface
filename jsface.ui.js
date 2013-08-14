(function() {
  "use strict";

  var win    = this,
      doc    = document,
      jsface = win.jsface,
      ui     = {};

  jsface.ui = ui;

  /**
   * Parse user agent string
   * Dev note: This function should generate flags based on ua only so it can be reused on server side (possibly stringify to client).
   * @param String ua user agent string
   * @return Object environment flags
   */
  ui.parseUA = function(ua) {
    var slash   = /[ |\/]/,
        ie      = /msie \d+/.exec(ua),
        chrome  = !ie && /chrome\/\d+/.exec(ua),
        firefox = !ie && !chrome && /firefox\/\d+/.exec(ua),
        safari  = !chrome && !firefox && !ie && /safari\/\d+/.exec(ua),
        opera   = !ie && !chrome && !firefox && !safari && /opera[ |\/]\d+/.exec(ua),
        browser = ie || chrome || firefox || safari || opera,
        name    = browser && browser[0].split(slash)[0],
        ipad    = safari && !!/ipad/.exec(ua),
        iphone  = safari && !!/iphone/.exec(ua),
        android = safari && !!/android/.exec(ua);

    firefox = firefox && firefox[0].split(slash)[1];
    chrome  = chrome && chrome[0].split(slash)[1];
    safari  = safari && /version\/\d+/.exec(ua)[0].split(slash)[1];
    opera   = opera && opera[0].split(slash)[1];
    ie      = ie && ie[0].split(slash)[1];
    name    = ie ? "ie" : name;

    return {
      name   : name,
      firefox: firefox,
      chrome : chrome,
      safari : safari,
      opera  : opera,
      ie     : ie,
      iphone : iphone,
      ipad   : ipad,
      android: android
    };
  };

  /**
   * Environment flags.
   */
  ui.env = function() {
    var ua       = navigator.userAgent.toLowerCase(),
        flags    = ui.parseUA(ua),
        touch    = win.Touch,
        protocol = win.location.protocol.toLowerCase();

    flags.ua           = ua;
    flags.touch        = touch;
    flags.worker       = !!win.Worker;
    flags.geolocation  = !!navigator.geolocation;
    flags.openDatabase = !!win.openDatabase;
    flags.video        = !!doc.createElement("video")["canPlayType"];
    flags.local        = (protocol === "file:");
    flags.https        = (protocol === "https:");

    return flags;
  }();

  /**
   * Add an event listener to a DOM object. Developers need to check for DOM ready before calling
   * as ui.bind() does not work when DOM is not ready.
   * Note: In all browsers, handler can call e.preventDefault() to prevent default behavior.
   * @param dom {Document} DOM element.
   * @param type {String} event type (load, click, change, etc...).
   * @param handler {Function} listener callback.
   * @param propagation {Boolean} stop propagation or not. Optional. Default is false.
   * @param preventDefault {Boolean} prevent default behavior or not. Optional. Default is false.
   */
  ui.bind = function(dom, type, handler, propagation, preventDefault){
    var len = arguments.length,                  // Save arguments length
        ie = ui.env.ie,                          // Shortcut
        wrapper = function(e){                   // Add event listener to a wrapper
        if (ie){                                 // preventDefault() becomes universal method
          e.preventDefault = function(){
            window.event.returnValue = false;
          };
        }
        var r = handler.call(dom, e);            // Execute handler, get its return value
        if (propagation === false){              // Check for propagation flag
          if (ie){                               // - For IE
            e.cancelBubble = true;
          } else {                               // - For other browsers
            e.stopPropagation();
          }
          r = false;                             // Set return value to false
        }
        if (len === 5 && preventDefault === true) {        // If preventDefault is true (must specify both propagation and preventDefault flags)
          if (ie){
            e.returnValue = false;
          } else {
            e.preventDefault();                            // Then prevent default behavior
          }
        }
        return r;
      },
      bClosure, bType, bLen, entry;

    // Convention: injected properties to external code always have _ui prefix
    handler._ui = handler._ui ? handler._ui : {};
    bClosure = handler._ui;                      // Shortcut
    bClosure[type] = bClosure[type] ? bClosure[type] : [];    // List of { dom: dom, handler: handler, wrapper: wrapper } for event *type*
    bType = bClosure[type];                                   // Another shortcut
    bLen = bType.length;

    // Make sure no duplication (same element, same type, same handler)
    while (bLen--){
      entry = bType[bLen];
      if (entry.dom === dom && entry.handler === handler){
        throw 'ui.bind: Event type ' + type + ' is already bound for element #' + dom.id + ' with the same handler';
      }
    }

    // Save the meta data (for unbind)
    bType.push({ dom: dom, handler: handler, wrapper: wrapper });

    // Bind event, ie has more market share, check for it first
    if (ie){
      dom.attachEvent('on' + type, wrapper);
    } else {
      dom.addEventListener(type, wrapper, false);
    }
  };

  /**
   * Remove an event listener from a DOM object. Developers need to check for DOM ready before calling
   * as ui.unbind() does not work when DOM is not ready.
   * @param dom {Document} DOM element.
   * @param type {String} event type (load, click, change, etc...).
   * @param handler {Function} listener callback. Optional. If handler is not passed, all handlers will be removed.
   */
  ui.unbind = function(dom, type, handler){
    if (handler._ui && handler._ui[type]){  // Work with ui.bind only, must bound before
      var bType = handler._ui[type],                   // Shortcut to the list
        len = bType.length, entry;
      while (len--){                                                // Search for the entry
        entry = bType[len];
        if (entry.dom === dom && entry.handler === handler){      // - Found: remove the wrapper handler
          if (ui.env.ie){
            dom.detachEvent('on' + type, entry.wrapper);
          } else {
            dom.removeEventListener(type, entry.wrapper, false);
          }
          bType.splice(len, 1);                                  // - And release some memory
          break;                                                 // - No more: get out
        }
      }
    }
  };

  /**
   * Trigger an event of a DOM element.
   * @param {Element} dom DOM element.
   * @param {String} type Event type.
   */
  ui.trigger = function(dom, type){
    if (document.createEventObject){                          // IE
      ui.trigger = function(dom, type){
        dom.fireEvent('on' + type, document.createEventObject())
      }
    } else {                                                  // Other browsers
      ui.trigger = function(dom, type){
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, true, true);                    // Event type, bubbling, able to cancel
        dom.dispatchEvent(e);
      }
    }
    ui.trigger(dom, type);
  };

  /**
   * Delegate an event of a DOM element to its parent.
   * Node: handler is executed under child context, it has an event as parameter.
   * @param parent {DOMElement} parent DOM element.
   * @param child {DOMElement} child element.
   * @param type {String} event type.
   * @param handler {Function} event handler.
   * @param bubbling {Boolean} bubble the event from parent to its parent or not (optional, default is true).
   * Note: bubbling has effect for parent element event bound by ui.delegate only. I.e:
   *    ui.delegate(P1, C1, 'click', F1);
   *    ui.delegate(C1, C2, 'click', F2, false);
   * When click event occurs, F2 will be executed, F1 is skipped as bubbling is false.
   */
  ui.delegate = function(parent, child, type, handler, bubbling){
    ui.delegate.parentNodes = ui.delegate.parentNodes ? ui.delegate.parentNodes: [];
    var parentNodes = ui.delegate.parentNodes, item,
      len = parentNodes.length,
      findNode = function(p){                                     // Find delegate data entry of parent
        var len = parentNodes.length;
        while (len--){
          if (parentNodes[len].node === p){
            return parentNodes[len];
            break;
          }
        }
      };
    item = findNode(parent);

    if ( !item){ // If not found, create the first data entry for parent
      item = {
        node: parent,
        handlers: {
          type: [{
            element: child,
            handler: handler,
            bubbling: (bubbling !== false)
          }]
        }
      };
      parentNodes.push(item);

      // Bind event to parent and delegate to child
      ui.bind(parent, type, function(pa){
        return function delegate(e, element, parentItem){
          var ie = ui.env.ie,                                       // Shortcut
            e = element ? e : (ie ? window.event : e),                    // e is passed by recursion along with element
            target = element ? element : (ie ? e.srcElement : e.target),  // in recursion, element is target
            item = parentItem ? parentItem : findNode(pa),                // parentItem exists in recursion only
            parent = element ? element.parent : pa;                       // pa is the original parent

          ui.each(item.handlers.type, function(index, handlerData){     // Find registered child in the list
            if (target === handlerData.element){                          // - Found it
              handlerData.handler.call(handlerData.element, e);         // - Invoke its handler with its context and event object e
              // If bubbling is true, send the event to target parent. Make sure
              // delegations of parent's element are invoked
              if (handlerData.bubbling){
                if (parent && parent.parentNode){                     // - First check for bubbling: is parent valid?
                  item = findNode(element ? element.parentNode : parent.parentNode);
                  if (item){                                        // - Second check: Is there any child registered delegation with the parent?
                    delegate(e, parent, item);                    // - Valid: bubble the event to it by recursion
                  }
                }
              }
            }
          });
        };
      }(parent));                                                               // Important: need to save original parent
    } else {     // Otherwise, just pass another data entry to parent handlers
      item.handlers.type.push({ element: child, handler: handler, bubbling: (bubbling !== false) });
    }
  };

  /**
   * Set or get attribute of a DOM element. You can get and set both tag attributes (class, id, etc.)
   * and css attributes (color, border, etc.).
   * @param {DOM} dom DOM element.
   * @param {Map/String} attr Attribute name or a map of attributes (name: value).
   * @param {String} value Value (if attr is a String).
   * Samples:
   *  + ui.attr(ui.byId('div1'), 'background-color');                                  // Get
   *  + ui.attr(ui.byId('div1'), 'background-color', 'white');                         // Set, one attribute
   *  + ui.attr(ui.byId('div1'), {'background-color': 'white', 'color': 'black'});     // Set, multiple attributes
   *
   * Note: IE returns color name when you get color attribute (like white, red, etc), other browsers returns rgb(x, y, z).
   *
   * TODO: Need many tests for this function.
   * @see http://w3schools.com/jsref/dom_obj_style.asp
   * @see http://w3schools.com/jsref/dom_obj_all.asp
   */
  ui.attr = function(dom, attr, value){
    // TODO: Don't need to support all attributes, maybe just some
    var attrs = 'id target title readOnly disabled alt checked href style innerHTML scrollTop scrollLeft scrollWidth clientHeight clientWidth name type value method action src rel'.split(' '),
      attributes = { 'class': 'className' };

    ui.each(attrs, function(index, val){
      attributes[val] = val;
    });

    // Clean up
    attrs = undefined;

    // Redefine ui.attr
    ui.attr = function(dom, attr, value){
      var text = '';

      // Set multiple attributes
      if (ui.isMap(attr)){
        ui.each(attr, function(key, val){
          if (attributes[key]){
            dom[attributes[key]] = val;
          } else {
            text += ';' + key + ':' + val;
          }
        });
        return dom.style.cssText += text + ';';
      }

      // Set one attribute
      if (arguments.length === 3){
        if (attributes[attr]){
          return dom[attributes[attr]] = value;
        }
        return dom.style.cssText += attr + ':' + value + ';';
      }

      // Get attribute from tag
      if (attributes[attr]){
        return dom[attributes[attr]];
      }

      // Get attribute from CSS
      if (dom.currentStyle){ // IE returns css via [backgroundColor, not background-color]
        text = dom.currentStyle[attr.replace(/\-(.)/g, function(m, l){ return l.toUpperCase(); })];
      } else if (window.getComputedStyle){ // Other browsers
        text = window.getComputedStyle(dom, null).getPropertyValue(attr);
      }

      // Pre-format some attribute values
      switch (attr){
        case 'width':    // Remove 'px' for width and height
        case 'height':
          return text.replace('px', ''); // parseInt(text)? which is faster?
      }
      return text;
    };
    // First call to ui.attr, use apply to make sure no argument lost
    return ui.attr.apply(this, arguments);
  };

  /**
   * Add css classes to a DOM element.
   * @param {DOM} dom DOM element.
   * @param {String} className css class names.
   * Samples:
   *   ui.addClass(ui.byId('div1'), 'black white');
   */
  ui.addClass = function(dom, className){
    var names = className.split(' '),
      len = num = names.length, count = 0,
      current = dom.className,
      name, re, sb = '\\b';

    // Make sure no duplication, remove all class names in current
    while (len--){
      name = ui.trim(names[len]);
      re = new RegExp(sb + name + sb, 'g');
      if (re.test(current)){
        count++;
        current = current.replace(re, '');
      }
    }

    // Update only there is a class name does not exist in dom.className
    // Otherwise, just skip. This helps to reduce browser repaint.
    if (count !== num){
      dom.className = current + ' ' + className;
    }
  };

  /**
   * Remove css classes from a DOM element.
   * @param {DOM} dom DOM element.
   * @param {String} className css class names.
   * Samples:
   *   ui.removeClass(ui.byId('div1'), 'black white');
   */
  ui.removeClass = function(dom, className){
    var names = className.split(' '),
      len = names.length,
      current = dom.className,
      name, re, found = false,
      sb = '\\b';

    // Remove name by name in current
    while (len--){
      name = ui.trim(names[len]);
      re = new RegExp(sb + name + sb, 'g');
      if (re.test(current)){
        current = current.replace(re , '');
        found = true;
      }
    }

    // Only update class name when found className to reduce browser painting
    if (found){
      dom.className = current;
    }
  };

  /**
   * Test DOM element having a class or not.
   * @param {DOM} dom DOM element.
   * @param {String} className css class name (single entry).
   * @return {Boolean} true if dom has the class, false if not.
   * Samples:
   *   ui.hasClass(ui.byId('div1'), 'black');
   */
  ui.hasClass = function(dom, className){
    var sb = '\\b';
    return new RegExp(sb + className + sb).test(dom.className);
  };

  /**
   * Element class
   */
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
