var eden = require('edencms');

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new eden.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

PostCategory.add({
	name: { type: String, required: true },
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'category' });

PostCategory.register();
