var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.data = {
		team: [],
		faq: [],
		aoCoinUSD: 0.01,
		aoCoinBTC: 0.0001,
	};
	var settings = {};
	var btcAmount = 0;
	var bchAmount = 0;
	var etcAmount = 0;
	var ltcAmount = 0;
	var btcValue = 0;

	view.on('init', function (next) {
		keystone.list('Setting').model.find().exec(function (err, data) {
			if (err) { console.log(err); }
			for (var i = 0; i < data.length; i++) {
				var setting = data[i];
				settings[setting.key] = setting.value;
			}
			next();
		});
	});


	view.on('init', function (next) {
		keystone.list('User').model.find().where('isFounder', true).exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}
			locals.data.team = results;
			next();
		});

	});

	view.on('init', function (next) {
		keystone.list('FAQ').model.find().where('onHome', true).exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}
			locals.data.faq = results;
			next();
		});
	});

	view.on('init', function (next) {
		keystone.list('Partner').model.find().exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}
			locals.data.partner = results;
			next();
		});
	});

	view.on('init', function (next) {
		keystone.list('Investment').model.count().exec(function (err, result) {
			if (err) {
				console.log(result);
				return next(err);
			}
			locals.data.investments = result;
			console.log(result);
			next();
		});
	});

	view.on('init', function (next) {
		btcValue = settings.btcValue || 0;
		btcAmount = settings.btcAmount || 0;
		bchAmount = settings.bchAmount || 0;
		etcAmount = settings.etcAmount || 0;
		ltcAmount = settings.ltcAmount || 0;
		locals.data.aoCoinUSD = btcAmount * btcValue;
		locals.data.btcAmount = _.round(parseFloat(btcAmount), 2);
		locals.data.bchAmount = _.round(parseFloat(bchAmount), 2);
		locals.data.etcAmount = _.round(parseFloat(etcAmount), 2);
		locals.data.ltcAmount = _.round(parseFloat(ltcAmount), 2);
		locals.data.aoCoinBTC = _.round(parseFloat(btcAmount) / 88000000, 2);
		locals.data.aoCoinUSD = locals.data.aoCoinUSD.toFixed(2);
		next();
	});

	// Render the view
	view.render('index');

};
