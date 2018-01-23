
/**
 * Created by justin on 5/27/16.
 */
var eden = require('edencms');
// var totp = require('quickotp').TOTP;

exports.get = function(req, res) {
	eden.list('User').model.findOne({_id: req.user.id}, function (findError, user) {
		if (findError) {
			next();
		} else {
			var response = {};
/*			var verifyToken = totp.verify(user.otpKey, req.query.token);
			
			if (verifyToken) {
				response = {success: true};
			} else {
				user.otpKey = "";
				user.otpURI = "";
				user.otpSecret = "";
				user.save(function (err) {
					if (err) {
						console.log(err);
					}
				});
				response = {success: false};
			}		
		
			res.apiResponse(response);
*/
		}
	});
};
