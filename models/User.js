var eden = require('edencms');
var Types = eden.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new eden.List('User');

User.add(
	{
		image: { type: Types.CloudinaryImage },
		name: { type: Types.Name, index: true, initial: true, required: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		address: { type: Types.Location },
		password: { type: Types.Password, initial: true, required: true },
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
		totalAOC: { type: Types.Money, noedit: false, default: 0  },
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
		referrer: { type: Types.Relationship, ref: 'User', filters: { isAffiliate: true } },
		referrerPercent: { type: Types.Number },
	},
	'Permissions',
	{
		isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
		isTeamMember: { type: Boolean },
		isFounder: { type: Boolean },
		isContributor: { type: Boolean },
		isAuthor: { type: Boolean },
		isEditor: { type: Boolean },
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

/*
User.schema.post('save', function(next) {
	var userEmail = {
		from: '"AOBlockchain" <Enquiry@noreply.aoblockchain.io>',// sender address
		to: this.email,// list of receivers
		subject: 'Your AO Blockchain Enquiry',// Subject line
		html: '<h1>We have received your Enquiry regarding AO Blockchain</h1><p>We will get back to you' +
		' within 2 business days.</p><p>For more information about AO Blockchain, please visit our' +
		' documentation:<br /><a href="https://docs.aoblockchain.io/"><h2>DOCUMENTATION' +
		' & WHITE PAPER</h2></a></p><p>Please' +
		' do not reply to this email, it is not a managed mailbox.</p>'
	};
	
	transporter.sendMail(userEmail,function(error, info){
		if(error){	
			return console.log(error);
		}
	});
});
*/
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
