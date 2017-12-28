var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
});

User.add(
	{
		image: { type: Types.CloudinaryImage },
		name: { type: Types.Name, index: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		password: { type: Types.Password, initial: true, required: true },
		referrer: { type: Types.Relationship, ref: 'User', filters: { isAffiliate: true } }
	},
	'Social', 
	{
		bio: { type: Types.Markdown },
		title: { type: String },
		twitter: { type: String, initial: true},
		linkedIn: { type: String, initial: true},
		github: { type: String, initial: true},
		skype: { type: String, initial: true},
		google: { type: String, initial: true},
		facebook: { type: String, initial: true},
		bctUser: { type: String, label: 'Bitcoin Talk Account', initial: true}
	},
	'Details', 
	{
		btcAddress: { type: String, label: 'BTC Send Address', initial: true },
		riseAddress: { type: String, label: 'RISE Address', initial: true },
		bounties: { type: Types.Relationship, ref: 'Bounty', filters: { status:'active' }, many: true }	
	},
	'Permissions', 
	{
		isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
		isTeamMember: { type: Boolean },
		isFounder: { type: Boolean }
	},
	'System',
	{
		createdAt: { type: Types.Datetime, default: Date.now, noedit: true },
		otpURI: { type: String, noedit: false },
		otpSecret: { type: String, noedit: false },
		otpKey: { type: String, noedit: false },
		investedBTC: {type: Number, noedit: true },
		referralBonus: {type: Number, noedit: true },
		BTCBonus: {type: Number, noedit: true },
		totalBTC: {type: Number, noedit: true },
		totalRise: { type: Number, noedit: false },
		riseWithdrew: { type: Boolean, label: 'RISE Withdrew' }
	}
);

/*User.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

User.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});


User.schema.methods.sendNotificationEmail = function(callback) {

	if ('function' !== typeof callback) {
		callback = function(error, body) {
			if(error) {console.log(error)};
			console.log("Attempt to send email");
		};
	}

	var user = this;
	
	new keystone.Email('enquiry-notification').send({
		to: user.email,
		from: {
			name: 'Rise Vision',
			email: 'affiliates@rise.vision'
		},
		subject: 'New Affiliate for Rise Vision',
		user: user
	}, callback);

};
 */

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
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


// TODO: Update views with updated Social Media links.
// TODO: Fix issue with keystone core where it defaults to jade and ignores hbs.
