var eden = require('edencms');

/**
 * Department Model
 * ==================
 */

var Department = new eden.List('Department', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Department.add({
	name: { type: String, required: true },
	description: { type: String, required: true, initial: true },
});

Department.relationship({ ref: 'User', path: 'users', refPath: 'departments' });

Department.register();
