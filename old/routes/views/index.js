var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	locals.data = {
		team: [],
		faq: [],
		riseUSD: 0.01,
		riseBTC: 0.0001
	};
	var settings = {};
	var btcAddress = process.env.BTC_ADDRESS;
	var btcAmount = 0;
	var btcValue = 0;
	
	view.on('init', function(next) {
		keystone.list('Setting').model.find().exec(function(err, data) {
			if (err) {console.log(err)}
			for (var i = 0; i < data.length; i++) {
				var setting = data[i];
				settings[setting.key] = setting.value;
			}
			next();
		});
	});
	
	
	view.on('init', function(next) {
		keystone.list('User').model.find().where('isFounder', true).exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}
			locals.data.team = results;
			next();
		});
		
	});
	
	view.on('init', function(next){
		keystone.list('FAQ').model.find().where('onHome', true).exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}
			locals.data.faq = results;
			next();
		});
	});
	
	view.on('init', function(next){
		keystone.list('Partner').model.find().exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			locals.data.partner = results;
			next();
		})
	});
	
	view.on('init', function(next) {
		keystone.list('Investment').model.count().exec(function(err, result) {
			if (err) {
				console.log(result)
				return next(err);
			}
			locals.data.investments = result;
			console.log(result)
			next();
		});
	});
	
	view.on('init', function(next) {
		btcValue = settings.btcValue;
		btcAmount = settings.btcAmount;
		locals.data.riseUSD = btcAmount*btcValue;
		locals.data.btcAmount = _.round(parseFloat(btcAmount), 8);
		locals.data.riseBTC = _.round(parseFloat(btcAmount) / 88000000, 8);
		locals.data.riseUSD = locals.data.riseUSD.toFixed(2); 
		next();
	});
	
	// Render the view
	view.render('index');
	
};
