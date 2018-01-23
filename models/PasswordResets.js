var eden = require('edencms');
var Types = eden.Field.Types;

var PasswordReset = new eden.List('PasswordReset', {});

PasswordReset.add({
	uuid: { type: Types.Relationship, ref: 'User' },
	expiration: { type: Types.Datetime },
	used: { type: Types.Boolean, default: false },
});

PasswordReset.defaultColumns = 'uuid, expiration, used';
PasswordReset.register();

