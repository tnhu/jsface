var print = this["print"] ? this["print"] : ((console && console.log) ? console.log : alert);

jsface.def("Utils", {
	$meta: {
		singleton: true
	},

	md5: function(msg) {
		return "Foo MD5 hash";
	}
});

print(Utils.md5());