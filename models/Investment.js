/**
 * Created by justin on 5/4/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;
var Client = require('coinbase').Client;
var client = new Client({
	'apiKey': process.env.CB_API_KEY,
	'apiSecret': process.env.CB_API_SECRET
});

var Investment = new keystone.List('Investment');

Investment.add({
	investor: {
		type: Types.Relationship,
		ref: 'User',
		initial: true
	},
	currency: {
		type: Types.Select,
		options: 'BTC, BCH, ETH, LTC',
		initial: true
	},
	address: {
		type: String,
		initial: true
	},
	amount: {
		type: Types.Number,
		initial: true
	},
	type: {
		type: Types.Select,
		options: 'Investment, Referral Bonus, Bonus, Bounty',
		initial: true
	},
	usdValue: {
		type: Types.Money,
		initial: true
	},
	totalValue: {
		type: Types.Money,
		initial: true
	},
	confirmed: {
		type: Boolean,
		initial: true
	},
	transID: {
		type: String,
		initial: true
	},
	createdAt: {
		type: Types.Datetime,
		default: Date.now,
		noedit: true
	},
});

Investment.schema.post('save', function () {
	var id = this.id;
	var amount = this.amount;
	var currency = this.currency;
	var type = this.type;

	if (this.amount / this.usdValue !== this.totalValue) {
		keystone.list('User').model.findOne({
			_id: this.investor
		}, function (err, user) {
			if (err) {
				console.log(err);
			}

			client.getExchangeRates({
				'currency': 'USD'
			}, function (err, rates) {
				if (err) {
					console.log(err);
				}
				var rate = rates.data.rates;
				rate = rate[currency];
				Investment.model.findOne({
					_id: id
				}, function (findError, investment) {
					if (findError) {
						// console.log(findError);
					} else {
						investment.usdValue = rate;
						investment.totalValue = amount / rate;
					}
					investment.save(function (err) {
						if (err) {
							//console.log(err);
						}
						if (type === 'Investment') {
							switch (currency) {
								case 'BTC':
									user.investedBTC = parseFloat(user.investedBTC) + parseFloat(amount);
									user.investedBTC = user.investedBTC.toPrecision(9);
									keystone.list('Setting').model.findOne({
										key: "btcAmount"
									}, function (err, btcAmount) {
										if(err){
											console.log(err);
										} else {
											btcAmount.value = parseFloat(btcAmount.value) + parseFloat(amount);
											btcAmount.save();
										}
									});
									break;
								case 'BCH':
									user.investedBCH = parseFloat(user.investedBCH) + parseFloat(amount);
									user.investedBCH = user.investedBCH.toPrecision(9);
									keystone.list('Setting').model.findOne({
										key: "bchAmount"
									}, function (err, bchAmount) {
										if(err){
											console.log(err);
										} else {
											bchAmount.value = parseFloat(bchAmount.value) + parseFloat(amount);
											bchAmount.save();
										}
									});
									break;
								case 'ETH':
									user.investedETH = parseFloat(user.investedETH) + parseFloat(amount);
									user.investedETH = user.investedETH.toPrecision(9);
									keystone.list('Setting').model.findOne({
										key: "ethAmount"
									}, function (err, ethAmount) {
										if(err){
											console.log(err);
										} else {
											ethAmount.value = parseFloat(ethAmount.value) + parseFloat(amount);
											ethAmount.save();
										}
									});
									break;
								case 'LTC':
									user.investedLTC = parseFloat(user.investedLTC) + parseFloat(amount);
									user.investedLTC = user.investedLTC.toPrecision(9);
									keystone.list('Setting').model.findOne({
										key: "ltcAmount"
									}, function (err, ltcAmount) {
										if(err){
											console.log(err);
										} else {
											ltcAmount.value = parseFloat(ltcAmount.value) + parseFloat(amount);
											ltcAmount.save();
										}
									});
									break;

								default:
									break;
							}
							user.totalUSD += investment.totalValue;
							user.totalUSD = user.totalUSD.toFixed(2);
							keystone.list('Setting').model.findOne({
								key: "marketCap"
							}, function (err, marketCap) {
								if(err){
									console.log(err);
								} else {
									marketCap.value = parseFloat(marketCap.value) + parseFloat(investment.totalValue);
									marketCap.save();
								}
							});
						}
						if (type === 'Referral Bonus') {
							var refBonus = amount / investment.usdValue;
							user.referralBonus += refBonus;
							user.referralBonus = user.referralBonus.toFixed(2);
							user.referredUSD = (user.referralBonus / 0.03).toFixed(2);
						}
						user.save(function (err) {
							if (err) {
								console.log(err);
							}
						});
					});
				});
			});
		});
	}
})

Investment.defaultColumns = 'investor, currency, amount, usdAmount, totalValue, type, confirmed';
Investment.register();
