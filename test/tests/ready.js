var context    = this,
    extend     = jsface.extend,
    each       = jsface.each,
    isMap      = jsface.isMap,
    isArray    = jsface.isArray,
    isFunction = jsface.isFunction,
    isString   = jsface.isString,
    isClass    = jsface.isClass;

test("$ready plugin: class notifies itself", function() {
  var notified = false;

  var Foo = Class({
    $ready: function(clazz, api, parent) {
      notified = true;
      equal(this, clazz, "$ready works incorrectly");
      ok(isFunction(api.$ready), "$ready works incorrectly");
      ok(isFunction(api.echo), "$ready works incorrectly");
      ok(isFunction(clazz.prototype.echo), "$ready works incorrectly");
      ok( !parent, "$ready works incorrectly");
    },
    echo: function(o) {
      return o;
    }
  });

  ok(notified, "$ready must be executed");
});

test("$ready plugin: class is notified when its subclasses are ready", function() {
  var notified = false;

  var Foo = Class({
    $ready: function(clazz, api, parent) {
      notified = true;

      if (this !== clazz) {
        ok(api.echo2, "$ready works incorrectly");
        ok( !api.$ready, "$ready works incorrectly");
        ok(isFunction(clazz.prototype.echo2), "$ready works incorrectly");
      }
    },
    echo: function(o) {
      return o;
    }
  });

  ok(notified, "$ready must be executed");

  var Bar = Class(Foo, {
    echo2: function(o) {
      return o;
    }
  });
});
