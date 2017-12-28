var keystone = require('keystone');
var Types = keystone.Field.Types;

var PasswordReset = new keystone.List('PasswordReset', {});

PasswordReset.add({
	uuid: { type: Types.Relationship, ref: 'User' },
	expiration: { type: Types.Datetime },
	used: { type: Types.Boolean, default: false },
});

PasswordReset.defaultColumns = 'uuid, expiration, used';
PasswordReset.register();

