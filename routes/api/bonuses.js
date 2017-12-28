/**
 * Created by justin on 5/27/16.
 */
/**
 * Created by justin on 5/27/16.
 */
var async = require('async'),
	keystone = require('keystone');
var _ = require('lodash');
// var totp = require('quickotp').TOTP;
var crypto = require('crypto');

function randomValueHex (len) {
	return crypto.randomBytes(Math.ceil(len/2))
		.toString('hex') // convert to hexadecimal format
		.slice(0,len);   // return required number of characters
}

exports.get = function(req, res) {
	keystone.list('User').model.findOne({_id: req.user.id}, function (findError, user) {
		if (findError) {
			next();
		} else {
			user.otpKey = randomValueHex(32);
//			user.otpURI = totp.create(user.otpKey, 'RiseVision Investor Profile');
//			user.otpSecret = user.otpURI.substr(user.otpURI.indexOf('=') + 1);
			user.save(function (err) {
				if (err) {
					console.log(err);
				}
				
//				res.apiResponse({uri: user.otpURI, otpSecret: user.otpSecret});
				
			});
		}
	});
};
/**
 * Created by justin on 5/27/16.
 */
