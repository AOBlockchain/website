var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.pageTitle = "Sign Up";
	locals.section = 'signUp';
	locals.formData = req.body || {};
	locals.validationErrors = {
		email: ''
	};
	locals.signedUp = false;
	if (req.cookies.affiliate) {
		locals.formData.referrer = req.cookies.affiliate;
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
				updater.process(req.body, {
					flashErrors: false,
					fields: 'name, email, address, twitter, bctUser, password, referrer',
					errorMessage: 'There was a problem submitting your request:'
				}, function (err) {
					if (err) {
						locals.validationErrors = err.error;
						if (err.name === 'MongoError') {
							locals.validationErrors = {email: 'This email is already in use'};
						}
						console.log(err);
					} else {
						locals.signedUp = true;
					}
					next();
				});
			} else {
				locals.validationErrors = {email: "This Email is already in use"};
				next();
			}
		})
	});
	view.render('signUp');

};



//TODO: If twitter / BCT username is added, attempt to auto link to Bounty Hunter
