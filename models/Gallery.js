var eden = require('edencms');
var Types = eden.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Gallery = new eden.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Date, default: Date.now },
	heroImage: { type: Types.CloudinaryImage },
	images: { type: Types.CloudinaryImages },
});

Gallery.register();
