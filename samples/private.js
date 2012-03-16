var Foo = Class(function(){
   var privateCounter = 0;

   function privateEcho(msg) {
      return msg;
   }

   return {
      constructor: function(name) {
         Foo.$super.call(this, name);
         privateCounter++;
      },

      echo: privateEcho
   }
});
