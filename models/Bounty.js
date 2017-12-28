/**
 * Created by justin on 4/28/16.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Bounty = new keystone.List('Bounty', {
	map: { name: 'bounty' },
});

Bounty.add({
	bounty: { type: String, required: true, initial: true },
	status: { type: Types.Select, options: 'active, completed', required: true, initial: true },
	value: { type: Types.Number, required: true, initial: true },
	createdAt: { type: Types.Datetime, default: Date.now, noedit: true },
});

Bounty.defaultColumns = 'bounty, status, value';
Bounty.register();

