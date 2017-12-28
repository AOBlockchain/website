/**
 * Created by justin on 5/10/16.
 */

var keystone = require('keystone');

var Investment = keystone.list('Investment');
var User = keystone.list('User');

exports.post = function(req, res) {

	var item = new Investment.model(),
		body = (req.method == 'POST') ? req.body : req.query;
	var data = {};
	if (body.bearerToken == process.env.BEARERTOKEN) {
		User.model.findOne().where({btcAddress:body.btcAddress}).exec(function(err, user) {
			if(user) {
				data.investor = body.investor;
				if (body.referrer) {
					var ref = JSON.parse(body.referrer);
					data.referrer = ref.id;
				}
				data.btcAddress = body.btcAddress;
				data.btcAmount = body.btcAmount;
				data.transID = body.txID;
				data.confirmed = true;
				data.createdAt = body.createdAt;
				item.getUpdateHandler(req).process(data, function(err) {

					if (err) return res.apiError('error', err);

					res.apiResponse({
						success: true,
						investment: item
					});

				})
			}
		});
	} else {
		res.apiResponse({
			success: false,
			error: "unauthorized user"
		});
	}
};
