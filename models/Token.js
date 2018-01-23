var eden = require('edencms');
var Types = eden.Field.Types;

var Token = new eden.List('Token', {
	map: { name: 'symbol' },
	defaultSort: '-createdAt',
});

Token.add({
	name: { type: String, initial: true },
	symbol: { type: String, initial: true },
	amount: { type: Types.Number },
	remaining: { type: Types.Number },
	divisible: { type: Types.Boolean },
	divisibleTo: { type: Types.Number, dependsOn: {divisible: true}, note: 'Number of decimal places'},
	price: { type: Types.Money, note: 'Token for sale amount' },
});

Token.schema.statics.availableCoin = function(cb) {
	return this.findOne({ remaining: {$gt:0} }).sort({remaining: 1}).exec(cb);
};



Token.defaultColumns = 'name, symbol';
Token.register();
