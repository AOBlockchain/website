var keystone = require('keystone');
var Types = keystone.Field.Types;

var Currency = new keystone.List('Currency', {
	map: { name: 'currency' },
	defaultSort: '-createdAt',
});

Currency.add({
	name: { type: String, initial: true },
	symbol: { type: String, initial: true },
	total: { type: Types.Number },
	totalFiat: { type: Types.Money },
});


Currency.defaultColumns = 'name, symbol';
Currency.register();
