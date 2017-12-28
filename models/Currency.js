var keystone = require('keystone');

var Currency = new keystone.List('Currency', {
	map: { name: 'currency' },
	defaultSort: '-createdAt',
});

Currency.add({
	name: { type: String, initial: true },
	symbol: { type: String, initial: true },
});


Currency.defaultColumns = 'name, symbol';
Currency.register();
