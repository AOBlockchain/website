var eden = require('edencms');
var Types = eden.Field.Types;
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var auth = {
	auth: {
	  api_key: process.env.MAILGUN_APIKEY,
	  domain: process.env.MAILGUN_DOMAIN,
	}
  }
  var transporter = nodemailer.createTransport(mg(auth));
/**
 * Enquiry Model
 * =============
 */

var Enquiry = new eden.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'partner', label: 'Partnership' },
		{ value: 'usd', label: 'I would like to buy in USD' },
		{ value: 'other', label: 'Something else...' },
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});


Enquiry.schema.post('save', function(next) {
	var userEmail = {
		from: '"AOBlockchain" <Enquiry@noreply.aoblockchain.io>',// sender address
		to: this.email,// list of receivers
		subject: 'Your AO Blockchain Enquiry',// Subject line
		html: '<h1>We have received your Enquiry regarding AO Blockchain</h1><p>We will get back to you' +
		' within 2 business days.</p><p>For more information about AO Blockchain, please visit our' +
		' documentation:<br /><a href="https://docs.aoblockchain.io/"><h2>DOCUMENTATION' +
		' & WHITE PAPER</h2></a></p><p>Please' +
		' do not reply to this email, it is not a managed mailbox.</p>'
	};
	var adminNotification = {
		from: '"AOBlockchain" <Enquiry@noreply.aoblockchain.io>',// sender address
		to: 'info@aoblockchain.io',// list of receivers
		subject: 'New AO Blockchain Enquiry',// Subject line
		html: '<h1>A new enquiry has arrived</h1>' +
		'<p>Name: ' + this.name.full + '</p> ' +
		'<p>Email: ' + this.email + '</p> ' +
		'<p>Phone: ' + this.phone + '</p> ' +
		'<p>Enquiry Type: ' + this.enquiryType + '</p> ' +
		'<p>Message: ' + this.message.html + '</p> '
	};
	transporter.sendMail(userEmail,function(error, info){
		if(error){	
			return console.log(error);
		}
	});
	transporter.sendMail(adminNotification,function(error, info){
		if(error){	
			return console.log(error);
		}
	});

});
Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
