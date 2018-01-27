var eden = require('edencms');

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
    
	// Render the view
	view.render('cookies');
};
