jsface.def("Foo", {
    Foo: [
        function() {               // Default constructor
        },
        function(name) {           // Constructor with one parameter
            this.name = name;
        },
        function(name, age) {      // Constructor with one parameter
            this.name = name;
            this.age = age;
        }
    ]
});

var foo    = new Foo();
var rika   = new Foo("Rika");
var rika24 = new Foo("Rika", 24);