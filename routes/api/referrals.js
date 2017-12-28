/**
 * Created by justin on 5/27/16.
 */
var async = require('async'),
	keystone = require('keystone');
var _ = require('lodash');
var Investment = keystone.list('Investment');

exports.get = function(req, res) {
	var body = (req.method == 'GET') ? req.body : req.query;
	section = 'ico';

	investments = [];
	referralInterval = [];

	Investment.model.find().sort('-date').exec(function(err, investments) {

		// Calculate Investments
		var referralInterval = []
		for (var i=0; i < investments.length; i++) {
			var investment = investments[i];
			var idt = investment.createdAt;
			var dateHour = new Date(idt.getFullYear(), idt.getMonth(), idt.getDate(), idt.getHours());
			dateHour = dateHour.toString();
			
			var referInt = _.find(referralInterval, { date: dateHour});
			if (referInt !== undefined) {
				if (investment.referrer) {
					referInt.value += _.round((investment.btcAmount * .03), 8);
					referInt.volume ++;	
				}
			} else {
				referInt = {};
				if (investment.referrer) {
					referInt.value = _.round((investment.btcAmount * .03), 8);
					referInt.volume = 0;
					referInt.date = dateHour;
					referralInterval.push(referInt);
				}
			}
		}

		if (err) return res.apiError('error', err);
		res.apiResponse(
			referralInterval
		);
	})
};
/**
 * Created by justin on 5/27/16.
 
,{
	"id": "g2",
		"valueField": "btcRefBonus",
		"type": "line",
		"balloonText": "RefBonus:<b>฿ [[btcRefBonus]]</b>"
}, {
	"id": "g3",
		"valueField": "btcBonus",
		"type": "line",
		"balloonText": "InvestBonus:<b>฿ [[btcBonus]]</b>"
}

 , {
                    "valueField": "refVolume",
                    "type": "column",
                    "showBalloon": true,
                    "fillAlphas": 1
                }
 */
