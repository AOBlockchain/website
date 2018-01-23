var eden = require('edencms');
var User = eden.list('User');
var _ = require('lodash');

exports = module.exports = function(req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;
	locals.pageTitle = "ICO Details";
	var affiliate = req.query.aff || false;
	if (affiliate) {
		res.cookie('affiliate', affiliate, { maxAge: 900000 } );
	}
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'ico';

	
	
	// Render the view
	view.render('ico');

};



// TODO: Add request parser for submitting form
