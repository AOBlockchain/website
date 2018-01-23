/**
 * Created by justin on 5/4/16.
 */
var eden = require('edencms');
var Types = eden.Field.Types;

var icons = [
	{ value:'icon-finance-260', label:'Currency' },
	{ value:'icon-finance-125', label:'Identity' },
	{ value:'icon-finance-029', label:'Assets' },
	{ value:'icon-finance-200', label:'Shares' },
	{ value:'icon-finance-122', label:'Contracts' },
	{ value:'icon-communication-043', label:'Infrastructure' },
	{ value:'icon-communication-003', label:'Delegates' },
]

var Feature = new eden.List('Feature',{
	map: { name: 'name' },
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
		previewPath: '/features', // Root url for previewing this list type. e.g '/blog/posts/
		}, 
});

Feature.add({
	name: { type: String, initial: true, required: true, index: true},
	icon: { type: Types.Select, options: icons },
	//category: { type: Types.Relationship, ref: 'FeatureCategory', many: false },
	features: { type: Types.List, fields: {
		question: { type: String },
		answer: { type: String }
	}},
	createdAt: { type: Types.Datetime, default: Date.now, noedit: true },
});

Feature.schema.methods.count = function() {
	return this.features.length;
}

Feature.defaultColumns = 'title, answer';
Feature.register();
