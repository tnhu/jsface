jsface.def("Foo", {
    Foo: {
        "String": function(name) {                 // Constructor with one String parameter
            this.name = name;
        },
        "String, Number": function(name, age) {    // Constructor with a String and a Number parameters
            this.name = name;
            this.age = age;
        }
    }
});

var rika   = new Foo("Rika");
var rika24 = new Foo("Rika", 24);