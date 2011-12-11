var Foo = Class(function(){
   var privateCounter = 0;

   function privateEcho(msg) {
      return msg;
   }

   return {
      constructor: function(name) {
         this.$super(name);
         privateCounter++;
      },

      echo: privateEcho
   }
});
