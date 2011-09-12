(function(){

var repository = {};

jsface.def("jsface.util.Events", {
   $meta: {
      singleton: true   
   },

   /**
    * Bind a callback into an event.
    */
   bind: function(event, callback) {
      repository[event] = repository[event] || [];
      repository[event].push(callback);
   },

   /**
    * Trigger an event.
    */
   trigger: function(event) {
      var args       = [].concat(Array.prototype.slice.apply(arguments)),
          event      = args.shift(),
          callbacks  = repository[event], 
          cb, i, len;
      
      if (callbacks) {
         for (i = 0, len = callbacks.length; i < len; i++) {
            cb = callbacks[i];
            cb.apply(cb, args);
         }
      }
   }
});

})();