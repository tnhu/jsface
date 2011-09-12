jsface.pointcuts(jsface.util.Events, {
   bind: function(event, fn) {
      console.log("EVENTS: Binding " + event);
   },

   trigger: function() {
      var args = [].concat(Array.prototype.slice.apply(arguments));
      console.log("EVENTS: Trigger " + args.shift() + " with params: " + args);
   }
});

alert(1);