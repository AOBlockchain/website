/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Affiliate program details
	// Views
	app.get('/', routes.views.index);
	app.get('/ico', routes.views.ico);
	app.get('/team', routes.views.team);
	app.get('/stats', routes.views.stats);
	app.all('/contact', routes.views.contact);
	app.all('/profile', routes.views.profile);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	// app.all('/signUp', routes.views.signUp);
	// app.all('/settings', routes.views.settings);
	app.get('/next-generation-economy', routes.views.nge);
	app.all('/requestReset', routes.views.requestReset);
	app.all('/passwordReset/:id', routes.views.passwordReset);
	// APIs
	// app.get('/api/investments', keystone.middleware.api, routes.api.investments.get);
	// app.get('/api/referrals', keystone.middleware.api, routes.api.referrals.get);
	app.get('/api/bonuses', keystone.middleware.api, routes.api.bonuses.get);
	// app.post('/api/coinbase/', keystone.middleware.api, routes.api.coinbase.post);
	app.get('/api/configQR', keystone.middleware.api, routes.api.bonuses.get);
	app.get('/api/checkOTP', keystone.middleware.api, routes.api.otpValidate.get);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
