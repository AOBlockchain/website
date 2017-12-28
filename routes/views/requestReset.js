var keystone = require('keystone');
var User = keystone.list('User');
var PWReset = keystone.list('PasswordReset');
var _ = require('lodash');
var nodemailer = require('nodemailer');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'requestReset';
	locals.formData = req.body || {};
	locals.validationErrors = {
		email: ''
	};
    
	view.on('post', {action: 'contact'}, function (next) {
		User.model.find({email:req.body.email}).exec(function (err, result) {
			if (err) {
				console.log(err)
			}
			if ( result.length === 0) {
			    locals.validationErrors = {email: "No account with this email exists in our system."};
			    next();
			} else {
				var newReset = new PWReset.model({
				    uuid : result[0]._id,
				    expiration : Date.now() + 86400000
				});
				
				newReset.save(function(err){
				    if(err){
				        console.log(err);
				    }
    		        PWReset.model.find().where('uuid', result[0]._id).sort('-expiration').limit(1).exec(function(err, pwr){
    		            if(err){
    		                console.log(err);
    		            }
						var transporter = nodemailer.createTransport('smtps://RiseVision:r1s3v1sion@smtp.sendgrid.net');
						var mailOptions = {
							from: '"Rise Vision Foundation" <no-reply@rise.vision>',// sender address
							to: req.body.email,// list of receivers
							subject: 'Your Requested Password Reset',// Subject line
							html: '<h1>You requested a password reset</h1><p>If you did not request a password' +
							' reset, ignore this email.</p><p>To reset your password, click on the following' +
							' link:<br /><a href="https://rise.vision/passwordReset/' + pwr[0]._id + '"><h2>RESET' +
							' PASSWORD and 2 Factor Authentication</h2></a></p><p>Please' +
							' do not reply to this email, it is not a managed box.</p>'
						};
						transporter.sendMail(mailOptions,function(error, info){
							if(error){
								return console.log(error);
							}
							console.log('Message sent: ' + info.response);


						});
						locals.emailSent = true;
						next();
	                    
				    });
				});
			}
		});
	});
	view.render('requestReset');
};
