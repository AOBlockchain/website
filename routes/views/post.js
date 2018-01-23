var eden = require('edencms');

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {

		var q = eden.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author category');

		q.exec(function (err, result) {
			locals.data.post = result;
			locals.pageTitle = result.title;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = eden.list('Post').model.find().where('publishing.state', 'published').sort('-publishing.date').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('post');
};
