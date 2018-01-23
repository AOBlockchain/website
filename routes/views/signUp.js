var eden = require('edencms');
var User = eden.list('User');

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.pageTitle = "Sign Up";
	locals.section = 'signUp';
	locals.formData = req.body || {};
	locals.validationErrors = {
		email: ''
	};
	var preSaleCutoff = new Date('2018-01-27T10:00:00');
	var today = Date.now();
	var referrerPercent = today < preSaleCutoff ? 0.05 : 0.03;
	locals.signedUp = false;
	if (req.cookies.affiliate) {
		locals.formData.referrer = req.cookies.affiliate;
		locals.formData.referrerPercent = referrerPercent;
	}
	// On POST requests, add the User item to the database
	view.on('post', {action: 'contact'}, function (next) {
		User.model.find({email:req.body.email}).exec(function (err, result) {
			if (err) {
				console.log(err)
			}
			if ( result.length === 0) {
				var newUser = new User.model(),
					updater = newUser.getUpdateHandler(req);
					console.log(req.body);
				updater.process(req.body, {
					flashErrors: false,
					fields: 'name, email, address, twitter, bctUser, password, referrer, referrerPercent',
					errorMessage: 'There was a problem submitting your request:'
				}, function (err) {
					if (err) {
						locals.validationErrors = err.detail;
						console.log(err);
						if (err.name === 'MongoError') {
							locals.validationErrors = {email: {error:"This Email is already in use"}};
						}
						console.log(err);
					} else {
						locals.signedUp = true;
					}
					next();
				});
			} else {
				locals.validationErrors = {email: {error:"This Email is already in use"}};
				next();
			}
		})
	});
	view.render('signUp');

};



//TODO: If twitter / BCT username is added, attempt to auto link to Bounty Hunter
