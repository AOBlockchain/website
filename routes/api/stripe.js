/**
 * Created by justin on 5/10/16.
 */

var eden = require('edencms');

var Investment = eden.list('Investment');
var User = eden.list('User');

var stripe = require("stripe")("sk_test_3KLVMvl31nsfJHdYLVqmCmuk");

exports.post = function (req, res) {

	var investment = new Investment.model();
	var body = (req.method == 'POST') ? req.body : req.query;

	User.model.findOne().where({
		email: body.user,
	}).exec(function (err, user) {
		var referred = false;
		if (err) {
			res.apiResponse({
				success: false,
				error: "error"
			});
		} else {
			if (user) {
				stripe.charges.create({
					amount: body.amount,
					currency: 'usd',
					description: 'AOC Purchase',
					source: body.token.id,
				}, function(err, charge){
					if (err) {
						console.log(err);
					} else {
						console.log(charge);
						var investment = new Investment.model({
							investor: user._id,
							address: "stripe",
							transID: charge.id,
							confirmed: true,
							createdAt: charge.created,
							amount: charge.amount *.01,
							currency: charge.currency.toUpperCase(),
							type: 'Investment',
						});
			
						investment.save(function (err) {
							if (err) return res.apiError('error', err);
							res.apiResponse({
								success: true,
								message: "investment created"
							});
						});
					}
					if (user.referrer !== undefined && user.referrer !== null && user.referrer !== '') {
						var trunkAmount = parseFloat(charge.amount*.01) * parseFloat(user.referrerPercent);
						trunkAmount = trunkAmount.toPrecision(2);
						var investment = new Investment.model({
							investor: user.referrer,
							address: "stripe",
							transID: charge.id,
							confirmed: true,
							createdAt: charge.created,
							amount: parseFloat(trunkAmount),
							currency: charge.currency.toUpperCase(),
							type: 'Referral Bonus',
						});
			
						investment.save(function (err) {
							if (err) {
								console.log(err);
							}
						});
					}
				})

			} else {
				res.apiResponse({
					success: false,
					error: "unknown user"
				});
			}
		}

	});
};
