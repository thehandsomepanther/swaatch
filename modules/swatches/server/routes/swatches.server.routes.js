'use strict';

module.exports = function(app) {
	var swatches = require('../controllers/swatches.server.controller');
	var swatchesPolicy = require('../policies/swatches.server.policy');

	// Swatches Routes
	app.route('/api/swatches').all()
		.get(swatches.list).all(swatchesPolicy.isAllowed)
		.post(swatches.create);

	app.route('/api/swatches/:swatchId').all(swatchesPolicy.isAllowed)
		.get(swatches.read)
		.put(swatches.update)
		.delete(swatches.delete);

	// Finish by binding the Swatch middleware
	app.param('swatchId', swatches.swatchByID);
};