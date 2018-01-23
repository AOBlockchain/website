var eden = require('edencms');

var Setting = new eden.List('Setting', {
	nocreate: true,
	nodelete: true,
});

Setting.add(
	{
		key: { type: String },
		value: { type: String },
	}
);

Setting.defaultColumns = 'key, value';
Setting.register();
