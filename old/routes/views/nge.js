/**
 * Created by justin on 5/4/16.
 */
var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'next-generation-economy';
	
	// Render the view
	view.render('next-generation-economy');

};
