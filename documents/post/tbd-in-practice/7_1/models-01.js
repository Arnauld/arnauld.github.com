exports.aggregate_root = function(identifier, inherits, features) {
  this.type = "aggregate_root";
  this.name = identifier;
  this.inherits = inherits;
  this.features = features;
};

exports.def = function(name, arguments) {
  this.type = "def";
  this.name = name;
  this.arguments = arguments;
};

exports.factory = function(name, arguments) {
  this.type = "factory";
  this.name = name;
  this.arguments = arguments;
};

exports.argument = function(argument_name, argument_type) {
  this.type = "argument";
  this.argument_name = argument_name;
  this.argument_type = argument_type;
};

exports.field = function(field_name, field_type) {
  this.type = "field";
  this.field_name = field_name;
  this.field_type = field_type;
};