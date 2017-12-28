/**
 * Created by justin on 5/4/16.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

var FAQ = new keystone.List('FAQ',{
	map: { name: 'title' }
});

FAQ.add({
	title: { type: String, initial: true, required: true, index: true},
	answer: { type: String, initial: true, required: true, index: true},
	onHome: { type: Boolean, initial: true, index: true},
	createdAt: { type: Types.Datetime, default: Date.now, noedit: true }
});


FAQ.defaultColumns = 'title, answer, onHome';
FAQ.register();
