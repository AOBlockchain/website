var keystone = require('keystone');
var Types = keystone.Field.Types;

var Setting = new keystone.List('Setting', {});

Setting.add(
	{
		key: { type: String },
		value: { type: String }
	}
);

Setting.defaultColumns = 'key, value';
Setting.register();
