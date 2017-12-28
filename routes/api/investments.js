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
	investmentInterval = [];
	var bonus = {
		'25': new Date("2016-05-12T10:00:00"),
		'20': new Date("2016-05-18T10:00:00"),
		'15': new Date("2016-05-24T10:00:00"),
		'10': new Date("2016-05-31T10:00:00")
	};
	
	Investment.model.find().sort('-date').exec(function(err, investments) {
		
		// Calculate Investments
		var investmentInterval = []
		for (var i=0; i < investments.length; i++) {
			var investment = investments[i];
			var idt = investment.createdAt;
			var dateHour = new Date(idt.getFullYear(), idt.getMonth(), idt.getDate(), idt.getHours());
			
			if (idt <= bonus['25']) {
				investBonus = 25;
			} else
			if (idt <= bonus['20']) {
				investBonus = 20;
			} else
			if (idt <= bonus['15']) {
				investBonus = 15;
			} else
			if (idt <= bonus['10']) {
				investBonus = 10;
			}
			
			var investInt = _.find(investmentInterval, { date: dateHour});
			if (investInt !== undefined) {
				if (investBonus > 0) {
					investInt.btcBonus += _.round(investment.btcAmount * (investBonus / 100), 8);
				}
				if (investment.referrer) {
					investInt.btcRefBonus += _.round((investment.btcAmount * .03), 8);
					investInt.refVolume ++;
				}
				investInt.btcAmount += _.round(investment.btcAmount, 8);
				investInt.btcVolume ++;
			} else {
				investInt = {};
				investInt.btcAmount = _.round(investment.btcAmount, 8);
				investInt.btcVolume = 1;
				if (investBonus > 0) {
					investInt.btcBonus = _.round(investment.btcAmount * (investBonus / 100), 8);
				} else {
					investInt.btcBonus = 0;
				}
				if (investment.referrer) {
					investInt.btcRefBonus = _.round((investment.btcAmount * .03), 8);
					investInt.refVolume = 1;
				} else {
					investInt.btcRefBonus = 0;
					investInt.refVolume = 0;
				}
				investInt.date = dateHour; 
				investmentInterval.push(investInt);
			}
		}
		
		if (err) return res.apiError('error', err);
		res.apiResponse(
			investmentInterval
		);
	})
};
