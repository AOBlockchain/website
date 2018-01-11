/**
 * Created by justin on 5/4/16.
 */
var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.pageTitle = "Meet the Team";
	locals.section = 'team';

	locals.data = {
		team: []
	};

	view.on('init', function(next) {
		keystone.list('User').model.find().where('isTeamMember', true).exec(function(err, results) {

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
