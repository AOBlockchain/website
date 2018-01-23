var eden = require('edencms');

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
}

exports = module.exports = function (req, res) {

	var view = new eden.View(req, res);
	var locals = res.locals;

	// Set locals
    locals.section = 'features';
    locals.pageTitle = "Blockchain Features";
	locals.data = {
        category: [],
    };
    var feature = [];

	// Load the current post
    
    view.on('init', function(next) {
        var f = eden.list('Feature').model.find().where({'publishing.state':'published'});

            f.exec(function (err, result) {
                if(err) {
                    console.log(err);
                    next();
                }
                locals.data.category = result;
                next();
            });
    });

	// Render the view
	view.render('features');
};
