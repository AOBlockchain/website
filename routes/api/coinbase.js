/**
 * Created by justin on 5/10/16.
 */

var eden = require('edencms');

var Investment = eden.list('Investment');
var User = eden.list('User');

var coinbase = require('coinbase');
exports.post = function(req, res) {

	var investment = new Investment.model();
	var body = (req.method == 'POST') ? req.body : req.query;
	
	var data = {};
	if (true) { 
		User.model.findOne().where({
			$or: [
				{btcAddress: body.data.address},
				{bchAddress: body.data.address},
				{ethAddress: body.data.address},
				{ltcAddress: body.data.address},
			]
		}).exec(function(err, user) {
			var referred = false;
			if (err) {
				console.log("user: " + err);
				res.apiResponse({
					success: false,
					error: "error"
				});
			}
			if(user) {
				var investment = new Investment.model({
					investor: user._id,
					address: body.data.address,
					transID: body.additional_data.transaction.id,
					confirmed: true,
					createdAt: body.createdAt,
					amount: parseFloat(body.additional_data.amount.amount),
					currency: body.additional_data.amount.currency,
					type: 'Investment',
				});

				investment.save(function(err) {
					if (err) return res.apiError('error', err);
					res.apiResponse({
						success: true,
						message: "investment created"
					});
				});
			} else {
				res.apiResponse({
					success: false,
					error: "unknown user"
				});
			}
			if(user.referrer !== undefined && user.referrer !== null && user.referrer !== '') {
				var trunkAmount = parseFloat(body.additional_data.amount.amount) * parseFloat(user.referrerPercent);
				trunkAmount = trunkAmount.toPrecision(9);
				var investment = new Investment.model({
					investor: user.referrer,
					address: body.data.address,
					transID: body.additional_data.transaction.id,
					confirmed: true,
					createdAt: body.createdAt,
					amount: parseFloat(trunkAmount),
					currency: body.additional_data.amount.currency,
					type: 'Referral Bonus',
				});

				investment.save(function(err) {
					if (err) {
						console.log(err);
					}
				});	
			}
		});
	} else {
		res.apiResponse({
			success: false,
			error: "unauthorized user"
		});
	}
};
