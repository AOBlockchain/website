var keystone = require('keystone');

var Setting = new keystone.List('Setting', {
	noedit: true,
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
