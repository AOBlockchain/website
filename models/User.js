var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add(
	{
		image: { type: Types.CloudinaryImage },
		name: { type: Types.Name, index: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		password: { type: Types.Password, initial: true, required: true },
		referrer: { type: Types.Relationship, ref: 'User', filters: { isAffiliate: true } },
	},
	'Social',
	{
		bio: { type: Types.Markdown },
		title: { type: String },
		twitter: { type: Types.Url, initial: true, note:'Requires full URL to work.' },
		linkedIn: { type: Types.Url, initial: true, note:'Requires full URL to work.' },
		github: { type: Types.Url, initial: true, note:'Requires full URL to work.' },
		bctUser: { type: String, label: 'Bitcoin Talk Account', initial: true },
	},
	'Investment Details',
	{
		totalUSD: { type: Types.Money, noedit: true, default: 0  },
		totalAOC: { type: Types.Money, noedit: true, default: 0  },
		investedUSD: { type: Types.Money, noedit: true, default: 0 },
		btcAddress: { type: String, label: 'BTC Send Address', nodedit:true },
		investedBTC: { type: Types.Number, noedit: true, default: 0  },
		bchAddress: { type: String, label: 'BCH Send Address', nodedit:true },
		investedBCH: { type: Types.Number, noedit: true, default: 0  },
		ethAddress: { type: String, label: 'ETH Send Address', nodedit:true },
		investedETH: { type: Types.Number, noedit: true, default: 0 },
		ltcAddress: { type: String, label: 'LTC Send Address', nodedit:true },
		investedLTC: { type: Types.Number, noedit: true, default: 0  },
		aocAddress: { type: String, label: 'AOC Address', initial: true },
		bounties: { type: Types.Relationship, ref: 'Bounty', filters: { status: 'active' }, many: true },
	},
	'Bonus Details',
	{
		referredUSD: { type: Types.Money, noedit: true, default: 0  },
		referralBonus: { type: Types.Money, noedit: true, default: 0  },
		USDBonus: { type: Types.Money, noedit: true, default: 0  },
	},
	'Permissions',
	{
		isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
		isTeamMember: { type: Boolean },
		isFounder: { type: Boolean },
	},
	'System',
	{
		createdAt: { type: Types.Datetime, default: Date.now, noedit: true },
		otpURI: { type: String, noedit: false },
		otpSecret: { type: String, noedit: false },
		otpKey: { type: String, noedit: false },
		aocWithdrew: { type: Boolean, label: 'AOC Withdrew' },
	}
);

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'Investment', path: 'investments', refPath: 'investor'});

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
