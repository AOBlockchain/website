/**
 * Created by justin on 5/26/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Partner = new keystone.List('Partner');

Partner.add({
	partner: { type: String, initial: true },
	url: { type: Types.Url, initial: true },
	logo: { type: Types.CloudinaryImage },
	description: { type: Types.Textarea}
});

Partner.defaultColumns = 'partner, url, description';
Partner.register();
