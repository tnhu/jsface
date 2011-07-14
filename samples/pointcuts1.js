// Apply pointcuts before declaring a class
var pointcuts = {
    Foo: {
        before: function() {
            this.before = true;
        },
        after: function() {
            this.after = true;
        }
    }
};

jsface.def("Foo", {
    $meta: {
        pointcuts: pointcuts
    },

    Foo: function() {
    },

    sayHi: function() {
    }
});

var foo = new Foo();

print(foo.before === true);
print(foo.after  === true);