var keystone = require('keystone');
var User = keystone.list('User');
var PWReset = keystone.list('PasswordReset');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var auth = {
	auth: {
	  api_key: process.env.MAILGUN_APIKEY,
	  domain: process.env.MAILGUN_DOMAIN,
	}
  }
  var transporter = nodemailer.createTransport(mg(auth));

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.pageTitle = "Request Password Reset";
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
						
						var mailOptions = {
							from: '"AOBlockchain" <PasswordReset@noreply.aoblockchain.io>',// sender address
							to: req.body.email,// list of receivers
							subject: 'Your Requested Password Reset',// Subject line
							html: '<h1>You requested a password reset from AOBlockchain.io</h1><p>If you did not request a password' +
							' reset, ignore this email.</p><p>To reset your password, click on the following' +
							' link:<br /><a href="https://aoblockchain.io/passwordReset/' + pwr[0]._id + '"><h2>RESET' +
							' PASSWORD</h2></a></p><p>Please' +
							' do not reply to this email, it is not a managed mailbox.</p>'
						};
						transporter.sendMail(mailOptions,function(error, info){
							if(error){
								
								return console.log(error);
							}


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
