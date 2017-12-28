var keystone = require('keystone');
var User = keystone.list('User');
var PWReset = keystone.list('PasswordReset');
var _ = require('lodash');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'passwordReset';
	locals.formData = req.body || {};
	locals.validationErrors = {
		email: ''
	};
	PWReset.model.find().where('_id', req.params.id).exec(function(err, pwr){
		if(err){
			console.log(err);
		}
		console.log(pwr);
		if(pwr.length !== 0 && pwr[0].expiration >= Date.now() && !pwr[0].used){
			locals.invalidId = false;
			
			view.on('post', {action: 'contact'}, function (next) {
				User.model.find({_id : pwr[0].uuid }).exec(function (err, result) {
					if (err) {
						console.log(err)
					}
					if (result.length === 0) {
						//account was deleted between the reset being requested and going to the link if we got here
				    	next();
					} else {
						var userUpdater = result[0].getUpdateHandler(req);
						userUpdater.process({ 
							password : req.body.password,
							otpURI : '',
							otpSecret : '',
							otpKey : ''
						}, {
							flashErrors: false,
							fields: 'password',
							errorMessage: 'There was a problem submitting your request:'
						}, function(err){
					    	if(err){
						        console.log(err);
						    }
						    var pwrUpdater = pwr[0].getUpdateHandler(req);
						    pwrUpdater.process({ used : true }, {
								flashErrors: false,
								fields: 'used',
								errorMessage: 'There was a problem submitting your request:'
							},function(err){
								if(err){
									console.log(err);
								}
							});
							locals.isPost = true;
							next();
						});
					}
				});
			});
		} else {
			locals.invalidId = true;
		}
		view.render('passwordReset');
	});
};