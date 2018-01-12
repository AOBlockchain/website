/**
 * Created by justin on 5/10/16.
 */

var keystone = require('keystone');

var Investment = keystone.list('Investment');
var User = keystone.list('User');
var coinbase = require('coinbase');
var client   = new coinbase.Client({'apiKey': process.env.CB_API_KEY, 'apiSecret': process.env.CB_API_SECRET});
var debug = true;

exports.post = function(req, res) {

	var investment = new Investment.model();
	var body = (req.method == 'POST') ? req.body : req.query;
	var data = {};
	if (debug) { //client.verifyCallback(req.raw_body, req.headers['CB-SIGNATURE'])) {
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
				console.log(err);
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
					amount: body.additional_data.amount.amount,
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
			if(user.referred !== null) {
				var trunkAmount = body.additional_data.amount.amount * user.referrerPercent;
				trunkAmount = trunkAmount.toPrecision(9);
				var investment = new Investment.model({
					investor: user.referrer,
					address: body.data.address,
					transID: body.additional_data.transaction.id,
					confirmed: true,
					createdAt: body.createdAt,
					amount: trunkAmount,
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
