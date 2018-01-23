/**
 * Created by justin on 5/4/16.
 */
var eden = require('edencms');

exports = module.exports = function(req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.pageTitle = "Meet the Team";
	locals.section = 'team';

	locals.data = {
		team: []
	};

	view.on('init', function(next) {
		eden.list('User').model.find().where('isTeamMember', true).exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}
			locals.data.team = results;
			next();
		});

	});

	// Render the view
	view.render('team');

};
