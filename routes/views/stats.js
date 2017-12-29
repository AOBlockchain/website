var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var settings = {};
	var investments = [];
	var affiliate = req.query.aff || false;
	if (affiliate) {
		res.cookie('affiliate', affiliate, { maxAge: 900000 });
	};

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'stats';
	locals.summary = {
		totalBTC: 0,
		investedBTC: 0,
		totalReferred: 0,
		btcRefBonus: 0,
		btcBonus: 0,
	};
	locals.investments = [];
	locals.investmentInterval = [];
	locals.referralInterval = [];
	locals.bonusInterval = [];
	var bonus = {
		25: new Date('2016-05-12T10:00:00'),
		20: new Date('2016-05-18T10:00:00'),
		15: new Date('2016-05-24T10:00:00'),
		10: new Date('2016-05-31T10:00:00'),
	};
	view.on('init', function (next) {
		keystone.list('Setting').model.find().sort('-date').exec(function (err, data) {
			if (err) { console.log(err); }
			for (var i = 0; i < data.length; i++) {
				var setting = data[i];
				settings[setting.key] = setting.value;
			}
			next();
		});
	});

	view.on('init', function (next) {
		keystone.list('Investment').model.find().exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			}
			investments = results;
			locals.summary.investmentCount = investments.length;
			next();
		});
	});
	view.on('get', function (next) {
		var dt = new Date().getTime();
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
		} else {
			locals.summary.bonus = 0;
		}

		// Calculate Investments

		for (var i = 0; i < investments.length; i++) {
			var investment = investments[i];
			var idt = investment.createdAt;
			var investBonus = 0;

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
			}
			locals.summary.investedBTC += investment.btcAmount;
			investment.btcRefBonus = 0;
			if (investBonus > 0) {
				investment.btcBonus = (investment.btcAmount * (investBonus / 100));
				locals.summary.btcBonus += investment.btcBonus;
			}
			if (investment.referrer) {
				investment.btcRefBonus = (investment.btcAmount * .03);
				locals.summary.btcRefBonus += investment.btcRefBonus;
				locals.summary.totalReferred += investment.btcAmount;
			}

			investment.btcBonus = _.round(investment.btcBonus, 8);
			investment.btcRefBonus = _.round(investment.btcRefBonus, 8);
			investment.btcAmount = _.round(investment.btcAmount, 8);
			var newDate = investment.createdAt.getFullYear().toString() + '-' + (investment.createdAt.getMonth()+1).toString() + '-' + investment.createdAt.getDate().toString() + ' ' + investment.createdAt.getHours().toString() + ':' + investment.createdAt.getMinutes().toString() + ':' + investment.createdAt.getSeconds().toString();

			investment.goodDate = newDate;
			locals.investments.push(investment);
		}

		locals.summary.btcAmount = _.round(investment.btcAmount, 8);
		locals.summary.totalBTC = locals.summary.investedBTC + locals.summary.btcBonus + locals.summary.btcRefBonus;

		// Calculate AOCoin/BTC

		locals.summary.riseBTC = (settings.btcAmount / 88000000.00).toFixed(8);
		// Calculate AOCoin/USD
		locals.summary.riseUSD = (settings.btcAmount * settings.btcValue / 88000000)

		// Calculate Total AOCoin
		// Count Total BTC invested
		// Invested / Total = percent
		// 88000000*percent = AOCoin + Bounties = Total AOCoin

		locals.summary.aoCoin = 88000000 * (locals.summary.totalBTC / locals.totalBTC);

		// clean up numbers
		locals.summary.aoCoin = _.round(locals.summary.aoCoin, 4);
		locals.summary.totalBTC = _.round(locals.summary.totalBTC, 8);
		locals.summary.btcBonus = _.round(locals.summary.btcBonus, 8);
		locals.summary.refBTC = _.round(locals.summary.refBTC, 8);
		locals.summary.btcRefBonus = _.round(locals.summary.btcRefBonus, 8);
		locals.summary.investedBTC = _.round(locals.summary.investedBTC, 8);
		locals.summary.riseUSD = _.round(locals.summary.riseUSD, 4);

		next();
	});

	// Render the view
	view.render('stats');

};

// TODO: Add request parser for submitting form
