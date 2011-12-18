var models = require("../lib/models");

exports["aggregate_root constructor"] = function (test) {
	var model = new models.aggregate_root("Story", ["HasComment"], []);
	test.strictEqual(model.type, "aggregate_root");
	test.strictEqual(model.name, "Story");
	test.ok(model.inherits instanceof Array);
	test.strictEqual(model.inherits.length, 1);
	test.strictEqual(model.inherits[0], "HasComment");

	test.done();
};

exports["def constructor"] = function (test) {
	var model = new models.def("activate", []);
	test.strictEqual(model.type, "def");
	test.strictEqual(model.name, "activate");
	test.ok(model.arguments instanceof Array);
	test.strictEqual(model.arguments.length, 0);

	test.done();
};

exports["factory constructor"] = function (test) {
	var model = new models.factory("create", []);
	test.strictEqual(model.type, "factory");
	test.strictEqual(model.name, "create");
	test.ok(model.arguments instanceof Array);
	test.strictEqual(model.arguments.length, 0);

	test.done();
};

exports["field constructor"] = function (test) {
	var model = new models.field("name", "String");
	test.strictEqual(model.type, "field");
	test.strictEqual(model.field_name, "name");
	test.strictEqual(model.field_type, "String");

	test.done();
};

exports["argument constructor"] = function (test) {
	var model = new models.argument("name", "String");
	test.strictEqual(model.type, "argument");
	test.strictEqual(model.argument_name, "name");
	test.strictEqual(model.argument_type, "String");

	test.done();
};