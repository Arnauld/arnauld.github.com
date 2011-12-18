var parser = require('../lib/parser').parser;
var models = require("../lib/models");
// set parser's shared scope
parser.yy = models;

var toString = function(input, indent) {
    return JSON.stringify(input, null, indent||"    ");
};

var check_field = function(test, feature, field_name, field_type) {
  test.strictEqual(feature.type, "field");
  test.strictEqual(feature.field_name, field_name);
  test.strictEqual(feature.field_type, field_type);
};

var check_behavior = function(test, feature, behavior_type, behavior_name, arguments) {
  test.strictEqual(feature.type, behavior_type);
  test.strictEqual(feature.name, behavior_name);
  test.ok(feature.arguments instanceof Array);

  // arguments to check against are provided
  if(typeof arguments !== "undefined") {
  	var length = arguments.length;

  	test.strictEqual(feature.arguments.length, length, "Wrong number of arguments");
  	var i;
  	for(i=0;i<length;i++) {
  		var expected = arguments[i];
  		var actual   = feature.arguments[i];
  		test.strictEqual(actual.type, "argument");
  		test.strictEqual(actual.argument_name, expected[0]);
  		test.strictEqual(actual.argument_type, expected[1]);
  	}
  }
};

exports["Simple input can be parsed"] = function (test) {
  var input  = 'aggregateRoot Story extends HasComment {}';
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 1);

  var element = parsed[0];
  test.ok(element instanceof models.aggregate_root);
  test.strictEqual(element.type, "aggregate_root");
  test.strictEqual(element.name, "Story");
  test.ok(element.inherits instanceof Array);
  // inherits
  test.strictEqual(element.inherits.length, 1);
  test.strictEqual(element.inherits[0], "HasComment");
  // no features
  test.ok(element.features instanceof Array);
  test.strictEqual(element.features.length, 0);
  test.done();
};

exports["Multiple but simple aggregates can be parsed"] = function (test) {
  var input  = ['aggregateRoot Story extends HasComment {}',
                'aggregateRoot StoryWithNoParent {}',
               ].join("\n");
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 2);

  var element1 = parsed[0];
  test.ok(element1 instanceof models.aggregate_root);
  test.strictEqual(element1.type, "aggregate_root");
  test.strictEqual(element1.name, "Story");
  test.ok(element1.inherits instanceof Array);
  test.strictEqual(element1.inherits.length, 1);
  test.strictEqual(element1.inherits[0], "HasComment");
  test.ok(element1.features instanceof Array);
  test.strictEqual(element1.features.length, 0);

  var element2 = parsed[1];
  test.ok(element2 instanceof models.aggregate_root);
  test.strictEqual(element2.type, "aggregate_root");
  test.strictEqual(element2.name, "StoryWithNoParent");
  test.ok(element2.inherits instanceof Array);
  test.strictEqual(element2.inherits.length, 0);
  test.ok(element2.features instanceof Array);
  test.strictEqual(element2.features.length, 0);

  test.done();
};

exports["Aggregate with defs and factory can be parsed"] = function (test) {
  var input  = ['aggregateRoot Story extends HasComment {',
				'  factory create(story_id:StoryId, story_title:String)',
                '  def change_complexity(complexity:Integer)',
				'  def change_business_value(value:Integer)',
                '}',
               ].join("\n");
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 1);

  var element = parsed[0];
  //console.log(toString(element));
  test.ok(element instanceof models.aggregate_root);
  test.strictEqual(element.type, "aggregate_root");
  test.strictEqual(element.name, "Story");

  //inherits
  test.ok(element.inherits instanceof Array);
  test.strictEqual(element.inherits.length, 1);
  test.strictEqual(element.inherits[0], "HasComment");

  // features
  test.ok(element.features instanceof Array);
  test.strictEqual(element.features.length, 3);
  check_behavior(test, element.features[0], "factory", "create", [["story_id", "StoryId"], ["story_title", "String"]]);
  check_behavior(test, element.features[1], "def", "change_complexity", [["complexity","Integer"]]);
  check_behavior(test, element.features[2], "def", "change_business_value", [["value","Integer"]]);

  test.done();
};

exports["Aggregate with def without argument can be parsed"] = function (test) {
  var input  = ['aggregateRoot Story extends HasComment {',
                '  def activate()',
                '}',
               ].join("\n");
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 1);

  var element = parsed[0];
  //console.log(toString(element));
  test.ok(element instanceof models.aggregate_root);
  test.strictEqual(element.type, "aggregate_root");
  test.strictEqual(element.name, "Story");
  
  // inherits
  test.ok(element.inherits instanceof Array);
  test.strictEqual(element.inherits.length, 1);
  test.strictEqual(element.inherits[0], "HasComment");

  // features
  test.ok(element.features instanceof Array);
  test.strictEqual(element.features.length, 1);
  test.strictEqual(element.features[0].type, "def");
  test.strictEqual(element.features[0].name, "activate");
  test.ok(element.features[0].arguments instanceof Array);
  test.strictEqual(element.features[0].arguments.length, 0);
  
  test.done();
};

exports["Aggregate with defs, factory and fields can be parsed"] = function (test) {
  var input  = ['aggregateRoot Story extends HasComment {',
                '  title:String',
                '  description:String',
				'  factory create(story_id:StoryId, story_title:String)',
                '  def change_complexity(complexity:Integer)',
				'  def change_business_value(value:Integer)',
                '}',
               ].join("\n");
  var parsed = parser.parse(input);

  test.ok(parsed instanceof Array);
  test.strictEqual(parsed.length, 1);

  var element = parsed[0];
  //console.log(toString(element));
  test.ok(element instanceof models.aggregate_root);
  test.strictEqual(element.type, "aggregate_root");
  test.strictEqual(element.name, "Story");
  test.ok(element.inherits instanceof Array);
  test.strictEqual(element.inherits.length, 1);
  test.strictEqual(element.inherits[0], "HasComment");

  test.ok(element.features instanceof Array);
  test.strictEqual(element.features.length, 5);

  check_field(   test, element.features[0], "title", "String");
  check_field(   test, element.features[1], "description", "String");
  check_behavior(test, element.features[2], "factory", "create", [["story_id", "StoryId"], ["story_title", "String"]]);
  check_behavior(test, element.features[3], "def", "change_complexity", [["complexity","Integer"]]);
  check_behavior(test, element.features[4], "def", "change_business_value", [["value","Integer"]]);

  test.done();
};
