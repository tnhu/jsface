var print = this["print"] ? this["print"] : ((console && console.log) ? console.log : alert);

// Basic class
jsface.def("sample.Foo", { 
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


var foo = new sample.Foo("John");
print(foo.getName());


var bar = new sample.Bar("Mary");
print(bar.getName());
