/**
 * Created by justin on 5/4/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Investment = new keystone.List('Investment');

Investment.add(
	{
		investor: { type: Types.Relationship, ref: 'User', initial: true },
		referrer: { type: Types.Relationship, ref: 'User', initial: true },
		currency: { type: Types.Relationship, ref: 'Currency', initial: true },
		address: { type: String, initial: true },
		Amount: { type: Types.Number, initial: true },
		usdValue: { type: Types.Number, initial: true },
		confirmed: { type: Boolean, initial: true },
		transID: { type: String, initial: true },
		createdAt: { type: Types.Datetime, default: Date.now },
	}
);

Investment.defaultColumns = 'investor, btcAddress, btcAmount, referrer, confirmed';
Investment.register();
