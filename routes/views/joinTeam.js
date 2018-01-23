var eden = require('edencms');
var _ = require('lodash');

exports = module.exports = function(req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.pageTitle = "Join Our Team";
	locals.section = 'join-team';

	
	
	// Render the view
	view.render('joinTeam');

};



// TODO: Add request parser for submitting form
