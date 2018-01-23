var eden = require('edencms');
var _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.pageTitle = "Home";
	locals.section = 'home';
	locals.data = {
		posts: [],
		featured: {},
	};
	var settings = {};
	var btcAmount = 0;
	var bchAmount = 0;
	var ethAmount = 0;
	var ltcAmount = 0;
	var btcValue = 0;
	var marketCap = 0;
	var preSaleCutoff = new Date('2018-01-27T10:00:00');
	var today = Date.now();
	var referrerPercent = today < preSaleCutoff ? 0.05 : 0.03;
	if (req.cookies.affiliate) {
		locals.formData.referrer = req.cookies.affiliate;
		locals.formData.referrerPercent = referrerPercent;
	}

	view.on('init', function (next) {
		eden.list('Setting').model.find().exec(function (err, data) {
			if (err) { console.log(err); }
			for (var i = 0; i < data.length; i++) {
				var setting = data[i];
				settings[setting.key] = setting.value;
			}
			next();
		});
	});

	view.on('init', function (next) {
		eden.list('Post').model.findOne().populate('author').sort({publishedDate:1}).exec(function (err, results) {

			if (err) {
				return next(err);
			}
			locals.data.featured = results;
			next();
		});
	});

	view.on('init', function(next) {
		eden.list('Post').model.find({'publishing.state':'published'}).populate('author category').sort({'publishing.date':1}).skip(1).limit(6).exec(function(err, results) {
			if(err || !results.length) {
				return next(err);
			}
			locals.data.posts = results;
			next();
		})
	})

	view.on('init', function (next) {
		eden.list('Investment').model.count().exec(function (err, result) {
			if (err) {
				return next(err);
			}
			locals.data.investments = result;
			next();
		});
	});

	view.on('init', function (next) {
		btcAmount = settings.btcAmount || 0;
		bchAmount = settings.bchAmount || 0;
		ethAmount = settings.ethAmount || 0;
		ltcAmount = settings.ltcAmount || 0;
		marketCap = settings.marketCap || 0;
		coinAvail = settings.coinAvail || 0;
		coinUSD = settings.coinUSD || 0;
		coinReserved = settings.coinReserved || 0;
		marketValue = parseFloat(coinReserved) * parseFloat(coinUSD);
		locals.data.avail = coinAvail;
		locals.data.reserved = coinReserved;
		locals.data.marketValue = _.round(parseFloat(marketValue), 2)
		locals.data.btcAmount = _.round(parseFloat(btcAmount), 4);
		locals.data.bchAmount = _.round(parseFloat(bchAmount), 4);
		locals.data.ethAmount = _.round(parseFloat(ethAmount), 4);
		locals.data.ltcAmount = _.round(parseFloat(ltcAmount), 4);
		locals.data.marketCap = _.round(parseFloat(marketCap), 2);
		next();
	});

	// Render the view
	view.render('index');

};
