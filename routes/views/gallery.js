var eden = require('edencms');

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.pageTitle = "Gallery";
	locals.section = 'gallery';

	// Load the galleries by sortOrder
	view.query('galleries', eden.list('Gallery').model.find().sort('sortOrder'));

	// Render the view
	view.render('gallery');

};
