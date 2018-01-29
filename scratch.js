var cb = require('coinbase').Client;

var client = new cb({'apiKey': 'lOsA0YLJqDkb6a79',
			'apiSecret': '6SLYPoh9ID5WVak94dLz8Y2b1JkAL4FY'});
			
client.getAccount({}, function(err, accounts) {
    console.log(err);
    console.log(accounts);
})
