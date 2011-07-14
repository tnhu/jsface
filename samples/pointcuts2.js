// Apply pointcuts after declaring a class
jsface.def("Foo", {
    Foo: function() {
    },

    sayHi: function() {
        this.say = true;
    }
});

var foo = new Foo();

// Apply pointcut to sayHi method on foo instance
jsface.pointcuts(foo, {
    sayHi: {
        before: function() {
            this.before = true;
        },
        after: function() {
            this.after = true;
        }
    }
});

foo.sayHi();
print(foo.before === true);
print(foo.say    === true);
print(foo.after  === true);