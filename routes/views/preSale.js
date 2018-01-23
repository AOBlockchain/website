var eden = require('edencms');
var User = eden.list('User');
var _ = require('lodash');

exports = module.exports = function(req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;
	locals.preSale = true;
	locals.pageTitle = "Pre-Sale Info";
	var affiliate = req.query.aff || false;
	if (affiliate) {
		res.cookie('affiliate', affiliate, { maxAge: 900000 } );
	}
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'pre-sale';

	
	
	// Render the view
	view.render('pre-sale');

};



// TODO: Add request parser for submitting form
