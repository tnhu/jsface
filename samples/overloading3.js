jsface.def("Foo", {
    Foo: {
        "String, Number: it > 0": function(name, age) {
            this.name = name;
            this.age = age;
        }
    }
});

var rika24 = new Foo("Rika", 0);  // Exception: Validating error at parameter 2