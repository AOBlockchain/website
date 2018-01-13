var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.pageTitle = "Home";
	locals.section = 'home';
	locals.data = {
		team: [],
		faq: []
	};
	var settings = {};
	var btcAmount = 0;
	var bchAmount = 0;
	var ethAmount = 0;
	var ltcAmount = 0;
	var btcValue = 0;
	var marketCap = 0;

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
			next();
		});
	});

	view.on('init', function (next) {
		btcValue = settings.btcValue || 0;
		btcAmount = settings.btcAmount || 0;
		bchAmount = settings.bchAmount || 0;
		ethAmount = settings.ethAmount || 0;
		ltcAmount = settings.ltcAmount || 0;
		marketCap = settings.marketCap || 0;
		locals.data.btcAmount = _.round(parseFloat(btcAmount), 10);
		locals.data.bchAmount = _.round(parseFloat(bchAmount), 10);
		locals.data.ethAmount = _.round(parseFloat(ethAmount), 10);
		locals.data.ltcAmount = _.round(parseFloat(ltcAmount), 10);
		locals.data.marketCap = _.round(parseFloat(marketCap), 2);
		next();
	});

	// Render the view
	view.render('index');

};
