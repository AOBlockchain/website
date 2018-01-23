// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
require('newrelic');

// Require eden
var eden = require('edencms');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

eden.init({
	'name': 'AO Blockchain System',
	'brand': 'AO Blockchain System',

	'static': 'public',
	'favicon': 'public/assets/img/icons/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'signin logo': ['/assets/img/icons/apple-icon-180x180.png', 180, 180],
	'signin redirect': '/profile',
});

// Load your project's Models
eden.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
eden.set('locals', {
	_: require('lodash'),
	env: eden.get('env'),
	utils: eden.utils,
	editable: eden.content.editable,
});

// Load your project's Routes
eden.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
eden.set('nav', {
	posts: ['posts', 'post-categories'],
	galleries: 'galleries',
	enquiries: 'enquiries',
	users: 'users',
	settings: ['tokens', 'settings'],
});

// Start Keystone to connect to your database and initialise the web server

eden.start();
