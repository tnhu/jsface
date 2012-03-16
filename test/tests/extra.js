var context = this;

// Helper to inject a script and execute a callback when it's fully loaded
// Note: Old versions of Opera don't work well with this method (11.60 works perfectly).
function getScript(url, callback) {
  var head   = document.getElementsByTagName("head")[0],
      script = document.createElement("script"),
      done   = false;

  script.src    = url;
  script.type   = "text/javascript";
  script.onload = script.onreadystatechange = function() {
    if ( !done && ( !this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
      done = true;
      isFunction(callback) && callback();
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    }
  }
  head.appendChild(script);
}

asyncTest("CommonJS support", function() {
  var head = document.getElementsByTagName("head")[0];

  // simulate CommonJS
  context.module = { exports: {} };

  getScript("../jsface.js", function() {
    var exports = context.module.exports;

    start();
    ok(exports.Class, "Class must be available in exports");
    ok(exports.isMap, "isMap must be available in exports");
    ok(exports.isArray, "isArray must be available in exports");
    ok(exports.isFunction, "isFunction must be available in exports");
    ok(exports.isString, "isString must be available in exports");
    ok(exports.isClass, "isClass must be available in exports");
    delete context.module;
  });
});

asyncTest("noConflict support", function() {
  var head = document.getElementsByTagName("head")[0];

  context.Class = function one() { return 1; };

  getScript("../jsface.js", function() {
    context.jsface.noConflict();
    start();
    equal(Class(), 1, "noConflict works incorrectly");

    getScript("../jsface.js", function() {});
    getScript("../jsface.ready.js", function() {});
    getScript("../jsface.pointcut.js", function() {});
  });
});
