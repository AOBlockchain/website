var eden = require('edencms');

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;

	// Set locals
    locals.section = 'solutions';
    locals.pageTitle = "Solutions";
	// Load the current post
    
	// Render the view
	view.render('comingSoon');
};
