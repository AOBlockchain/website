var eden = require('edencms');
var Types = eden.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new eden.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	history: true, 
	revisions: { 
		enabled: true, 
		excludeFields: ['publishing', 'publishDate', 'updatedBy', 'updatedAt'] ,
	},
	publishing: {  
		enabled: true, // can be disabled  
		stateField: 'publishing.state', // field to publishing content state
		selfApproval: true, // Allows users to self approval to change state
		approvalStates: ['draft', 'published', 'archived', 'deleted'],
		previewStates: ['draft', 'published', 'archived', 'deleted'], // States that can be viewed in preview mode
		unpublishStates: ['archived','draft'], // default state for unpublished content
		publishStates: ['published'],
		previewPath: '/blog/', // Root url for previewing this list type. e.g '/blog/posts/
		}, 
});

Post.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	category: { type: Types.Relationship, ref: 'PostCategory', many: false },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
