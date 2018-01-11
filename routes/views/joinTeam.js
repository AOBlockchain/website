var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.pageTitle = "Join Our Team";
	locals.section = 'join-team';

	
	
	// Render the view
	view.render('joinTeam');

};



// TODO: Add request parser for submitting form
