var keystone = require('keystone');
var Settings = keystone.list('Setting');
var _ = require('lodash');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var settings = {};
	var bonus = {
		'25': new Date("2016-05-12T10:00:00"),
		'20': new Date("2016-05-18T10:00:00"),
		'15': new Date("2016-05-24T10:00:00"),
		'10': new Date("2016-05-31T10:00:00")
};
	var locals = res.locals;
	locals.section = 'profile';
	locals.summary = {
		aoCoin: 0,
		riseBTC: 0,
		riseUSD: 0,
		investedBTC: 0,
		refBTC: 0,
		refTrans: 0,
		btcBonus: 0,
		totalBTC: 0,
		btcRefBonus: 0,
		investments: []
	};
	locals.totalBTC = 0;
	investments = [];
	allInvestments = [];
	locals.referrals = {};
	locals.bounties = {};
	locals.bountyHunters = {};
	var ids = {};
	ids.twitter = '';
	ids.trans = '';
	ids.sig = '';

	if (req.user) {
		// Collect Data
		view.on('init', function(next) {
			Settings.model.find().exec(function(err, data) {
				if (err) {console.log(err)}
				for (var i = 0; i < data.length; i++) {
					var setting = data[i];
					settings[setting.key] = setting.value;
				}
				next();
			});
		});
		view.on('init', function (next) {
			keystone.list('Investment').model.find({ $or:[{'investor': req.user._id},{'referrer': req.user._id}]}).exec(function (err, results) {
				if (err || !results.length) {
					return next(err);
				}
				investments = results;
				next();
			});
		});
		view.on('init', function (next) {
			keystone.list('Investment').model.find().exec(function (err, results) {
				if (err || !results.length) {
					return next(err);
				}
				allInvestments = results;
				next();
			});
		});
		view.on('init', function (next) {
			keystone.list('Bounty').model.find().where('status', 'active').exec(function (err, results) {
				if (err || !results.length) {
					return next(err);
				}
				locals.bounties = results;
				for (var i = 0; i < locals.bounties.length; i++) {
					if (locals.bounties[i].bounty == 'Twitter') {
						ids.twitter = locals.bounties[i]._id;
					}
					if (locals.bounties[i].bounty == 'Signature') {
						ids.sig = locals.bounties[i]._id;
					}
					if (locals.bounties[i].bounty == 'Translations') {
						ids.trans = locals.bounties[i]._id;
					}
				}
				next();
			});
		});
		
		view.on('init', function (next) {
			var dt =new Date().getTime();
			if (dt <= bonus['25']) {
				locals.summary.bonus = 25;
				locals.summary.bonusEndTime = bonus['25'].getTime();
			} else
			if (dt <= bonus['20']) {
				locals.summary.bonus = 20;
				locals.summary.bonusEndTime = bonus['20'].getTime();
			} else
			if (dt <= bonus['15']) {
				locals.summary.bonus = 15;
				locals.summary.bonusEndTime = bonus['15'].getTime();
			} else
			if (dt <= bonus['10']) {
				locals.summary.bonus = 10;
				locals.summary.bonusEndTime = bonus['10'].getTime();
			}

			// Calculate Investment
			for (var i=0; i < investments.length; i++) {
				var investment = investments[i];
				var idt = investment.createdAt;
				var investBonus = 0;
				investment.btcBonus = 0;

				if (idt <= bonus['25']) {
					investBonus = 25;
				} else
				if (idt <= bonus['20']) {
					investBonus = 20;
				} else
				if (idt <= bonus['15']) {
					investBonus = 15;
				} else
				if (idt <= bonus['10']) {
					investBonus = 10;
				} else {
					investBonus = 0;
				}
				if (investment.investor.toString() === req.user._id.toString()) {
					locals.summary.investedBTC += investment.btcAmount;
					investment.btcRefBonus = 0;
					investment.type = "Investment";
					if (investBonus > 0) {
						investment.btcBonus = (investment.btcAmount * (investBonus / 100));
					}
					
					locals.summary.investments.push(investment);
					locals.summary.btcBonus += investment.btcBonus;
				} else {
					locals.summary.totalRefBTC += investment.btcAmount;
					investment.btcRefBonus = (investment.btcAmount *.03);
					locals.summary.refBTC += investment.btcAmount;
					locals.refTrans += 1;
					investment.type = 'Referral';
					if (investBonus >0) {
						investment.btcBonus = (investment.btcRefBonus * (investBonus / 100));
					}
					locals.summary.btcBonus +=investment.btcBonus;
					locals.summary.investments.push(investment);
				}
				locals.summary.btcRefBonus += investment.btcRefBonus;
				investment.btcBonus = _.round(investment.btcBonus, 8);
				investment.btcRefBonus = _.round(investment.btcRefBonus, 8);
				investment.btcAmount = _.round(investment.btcAmount, 8);
			}
			
			for (var i=0; i < allInvestments.length; i++) {
				
				investment = allInvestments[i];
				idt = investment.createdAt;
				if (idt <= bonus['25']) {
					investBonus = 25;
				} else
				if (idt <= bonus['20']) {
					investBonus = 20;
				} else
				if (idt <= bonus['15']) {
					investBonus = 15;
				} else
				if (idt <= bonus['10']) {
					investBonus = 10;
				} else {
					investBonus = 0;
				}
				var btcAmount = investment.btcAmount;
				var btcBonus = btcAmount * (investBonus / 100);
				
				var btcRefBonus = 0;
				if (investment.referrer) {
					btcRefBonus = btcAmount * .03;
				}
				locals.totalBTC += btcAmount + btcBonus + btcRefBonus;
			}
			
			locals.summary.totalBTC = locals.summary.investedBTC + locals.summary.btcBonus + locals.summary.btcRefBonus;

			// Calculate AOCoin/BTC
			
			locals.summary.riseBTC = (settings.btcAmount / 88000000.00).toFixed(8);
			// Calculate AOCoin/USD
			locals.summary.riseUSD = (settings.btcAmount * settings.btcValue / 88000000)
			
			// Calculate Total AOCoin
			// Count Total BTC invested
			// Invested / Total = share
			// 88000000*share = AOCoin + Bounties = Total AOCoin
			
			
			// clean up numbers
			locals.summary.totalBTC = _.round(locals.summary.totalBTC, 8);
			locals.summary.btcBonus = _.round(locals.summary.btcBonus, 8);
			locals.summary.refBTC = _.round(locals.summary.refBTC, 8);
			locals.summary.btcRefBonus = _.round(locals.summary.btcRefBonus, 8);
			locals.summary.investedBTC = _.round(locals.summary.investedBTC, 8);
			locals.summary.riseUSD = _.round(locals.summary.riseUSD, 4);
			locals.summary.aoCoin = ((88000000 / locals.totalBTC) * locals.summary.totalBTC);
			locals.summary.aoCoin = _.round(locals.summary.aoCoin, 8);

			next();
		});
		

		// Update Profile
		view.on('post', {action: 'editProfile'}, function (next) {

			keystone.list('User').model.findOne({_id: req.user.id}, function (findError, user) {
				if (findError) {
					console.log(findError);
					next();
				} else {
					if (req.body.email !== user.email) {
						user.email = req.body.email;
					}
					if (req.body.bctUser !== user.bctUser) {
						user.bctUser = req.body.bctUser;
					}
					if (req.body.twitter !== user.twitter) {
						user.twitter = req.body.twitter;
					}
					if (req.body.btcUser !== user.btcUser) {
						user.btcUser = req.body.btcUser;
					}
					if (req.body.github !== user.github) {
						user.github = req.body.github;
					}
					if (req.body.linkedIn !== user.linkedIn) {
						user.linkedIn = req.body.linkedIn;
					}
					if (req.body.facebook !== user.facebook) {
						user.facebook = req.body.facebook;
					}
					user.save(function (err) {
						if (err) {
							locals.validationErrors = err.errors;
							if (err.name === 'MongoError') {
								locals.validationErrors = {email: 'This email is already in use'};
							}
						}
					});
					res.redirect('/profile');
				}
			});
			
		});
		
		view.on('post', {action: 'withdrawRISE'}, function(next) {
			var Client = require('node-rest-client').Client;
			var client = new Client();
			var baseURL = process.env.RISEAPIBASE;
			locals.riseAddress = req.body.riseAddress;
			var addressCheck = /^[0-9]{1,21}[R|r]$/g; 
			var isAddress = addressCheck.test(req.body.riseAddress);
			
			if (!isAddress) {
				locals.validationErrors = {riseAddress: "Invalid address"};
			} else if (!req.user.riseWithdrew) {
				var riseToSend = parseInt(req.user.totalRise * 100000000);
				var args = {
					data: {
						"secret" : process.env.INVESTWALLETSECRET,
						"amount" : riseToSend,
						"recipientId" : locals.riseAddress
					},
					headers: { "Content-Type": "application/json"}
				};
				
				keystone.list('User').model.findOne({_id: req.user.id}, function (findError, user) {
						if (findError) {
							console.log(findError);
						} else {
							user.riseWithdrew = true;
							user.riseAddress = locals.riseAddress;
							user.save(function (err) {
								if (err) {
									locals.validationErrors = err.errors;
									if (err.name === 'MongoError') {
										locals.validationErrors = {email: 'This email is already in use'};
									}
								}
								client.put(baseURL + "/api/transactions", args, function (data, response) {
									// parsed response body as js object
									console.log(data);
									if (data.success) {
										user.totalRise = 0;
										user.riseWithdrew = true;
										user.save(function (err) {
											if (err) {
												locals.validationErrors = err.errors;
												if (err.name === 'MongoError') {
													locals.validationErrors = {email: 'This email is already in use'};
												}
											}
										});
									} else {
										locals.validationErrors = {riseAddress:data.error};
										user.riseWithdrew = false;
										user.save(function (err) {
											if (err) {
												locals.validationErrors = err.errors;
												if (err.name === 'MongoError') {
													locals.validationErrors = {email: 'This email is already in use'};
												}
											}
										});
									}
								});
							});
						}
				});
			}

			next();
		});
	}
	view.render('profile');
};
