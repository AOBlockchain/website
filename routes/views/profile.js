var keystone = require('keystone');
var Settings = keystone.list('Setting');
var _ = require('lodash');
var cb = require('coinbase').Client;

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var settings = {};
	var locals = res.locals;
	locals.pageTitle = "Supporter Profile";
	locals.section = 'profile';
	locals.key = 'profile';
	locals.summary = {
		aoCoin: 0,
		aoCoinBTC: 0,
		aoCoinBHC: 0,
		aoCoinETC: 0,
		aoCoinLTC: 0,
		aoCoinUSD: 0,
		currentTime: Date.now(),
		investments: [],
	};
	locals.user = {};

	if (req.user) {
		locals.user = req.user;
		view.on('init', function(next) {
			keystone.list('Investment').model.find({investor: req.user._id}, function (findError, investments) {
				if (findError) {
					console.log(findError);
					next();
				} else {
					locals.summary.investments = investments;
					next();
				}
			});
		});	
		view.on('post', { action: 'getBTCAddress' }, function (next) {
			var client = new cb({'apiKey': process.env.CB_API_KEY,
			'apiSecret': process.env.CB_API_SECRET});
			
			client.getAccount(process.env.BTC_ACCOUNT, function(err, account) {
				account.createAddress(null, function(err, address) {
					if (err) {
						console.log(err);
					} else {
						keystone.list('User').model.findOne({_id: req.user._id}, function (findError, user) {
							if (findError) {
								console.log(findError);
								next();
							} else {
								user.btcAddress = address.address;
							}
							user.save(function (err) {
								if (err) {
									locals.validationErrors = err.errors;
									next();
								} else {
									res.redirect('/profile');
								}

							});
						});
					}					
				});
			});
		});

		view.on('post', { action: 'getBCHAddress' }, function (next) {
			var client = new cb({'apiKey': process.env.CB_API_KEY,
			'apiSecret': process.env.CB_API_SECRET});
			client.getAccount(process.env.BCH_ACCOUNT, function(err, account) {
				account.createAddress(null, function(err, address) {
					if (err) {
						console.log(err);
					} else {
						keystone.list('User').model.findOne({_id: req.user._id}, function (findError, user) {
							if (findError) {
								console.log(findError);
								next();
							} else {
								user.bchAddress = address.address;
							}
							user.save(function (err) {
								if (err) {
									locals.validationErrors = err.errors;
									next();
								} else {
									res.redirect('/profile');
								}

							});
						});
					}					
				});
			});
		});

		view.on('post', { action: 'getETCAddress' }, function (next) {
			var client = new cb({'apiKey': process.env.CB_API_KEY,
			'apiSecret': process.env.CB_API_SECRET});
			client.getAccount(process.env.ETC_ACCOUNT, function(err, account) {
				account.createAddress(null, function(err, address) {
					if (err) {
						console.log(err);
					} else {
						keystone.list('User').model.findOne({_id: req.user._id}, function (findError, user) {
							if (findError) {
								console.log(findError);
								next();
							} else {
								user.ethAddress = address.address;
							}
							user.save(function (err) {
								if (err) {
									locals.validationErrors = err.errors;
									next();
								} else {
									res.redirect('/profile');
								}

							});
						});
					}					
				});
			});
		});

		view.on('post', { action: 'getLTCAddress' }, function (next) {
			var client = new cb({'apiKey': process.env.CB_API_KEY,
			'apiSecret': process.env.CB_API_SECRET});
			client.getAccount(process.env.LTC_ACCOUNT, function(err, account) {
				account.createAddress(null, function(err, address) {
					if (err) {
						console.log(err);
					} else {
						keystone.list('User').model.findOne({_id: req.user._id}, function (findError, user) {
							if (findError) {
								console.log(findError);
								next();
							} else {
								user.ltcAddress = address.address;
							}
							user.save(function (err) {
								if (err) {
									locals.validationErrors = err.errors;
									next();
								} else {
									res.redirect('/profile');
								}

							});
						});
					}					
				});
			});
		});
	}
	view.on('post', {action: 'editProfile'}, function (next) {

		keystone.list('User').model.findOne({_id: req.user.id}, function (findError, user) {
			if (findError) {
				console.log(findError);
				next();
			} else {
				console.log(req.body);
				if (req.body.firstName !== user.name.first) {
					user.name.first = req.body.firstName;
				}
				if (req.body.lastName !== user.name.last) {
					user.name.last = req.body.lastName;
				}
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
	view.render('profile');
};
