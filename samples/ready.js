var print = this["print"] ? this["print"] : ((console && console.log) ? console.log : alert);

// Basic class
jsface.def("sample.Foo", {
	$meta: {
		ready: function(clazz, opts) {
			if (clazz !== sample.Foo) {
				print("Foo receives class declaration from its subclass named " + opts.$meta.name);
			}
		}
	},
   /** 
    * Constructor. 
    */ 
   Foo: function(name) { 
      this.name = name; 
   }, 
   getName: function() { 
      return "Hello " + this.name; 
   } 
});

// A sub class
jsface.def("sample.Bar", sample.Foo, { 
   /** 
    * Constructor. 
    */ 
   Bar: function(name) { 
      sample.Foo.apply(this, arguments); 
   },

   getName: function() { 
      return sample.Foo.prototype.getName.apply(this);
   } 
});