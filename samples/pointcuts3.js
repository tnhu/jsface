// Apply pointcuts after declaring a class
jsface.def("Foo", {
    Foo: function() {
    },

    sayHi: function() {
        this.say = true;
    }
});

var foo = new Foo();

jsface.pointcuts(foo, {
    sayHi: {
        before: function() {
            this.before = true;
            return false;           // Skip invoking actual sayHi() and after()
        },
        after: function() {
            this.after = true;
        }
    }
});

foo.sayHi();
print(foo.before === true);
print(foo.say    === undefined);
print(foo.after  === undefined);