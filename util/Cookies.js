/**
 * Cookies utilities.
 */
jsface.def("jsface.util.Cookies", {
   $meta: {
      singleton: true
   },

   get: function(name) {
      var i, x, y, 
          cookies = document.cookie.split(";"), 
          len     = cookies.length;
      
      for (i = 0; i < len; i++) {
         x = cookies[i].substr(0, cookies[i].indexOf("="));
         y = cookies[i].substr(cookies[i].indexOf("=") + 1);
         x = x.replace(/^\s+|\s+$/g, "");
         
         if (x === name) {
            return unescape(y);
         }
      }      
   },

   set: function(name, value, days) {
      var date = new Date(),
          val;
      
      date.setDate(date.getDate() + days);
      val = escape(value) + ( !days ? "" : "; expires=" + date.toUTCString());
       
      document.cookie = name + "=" + val;
   }
});