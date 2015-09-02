'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Swatch = mongoose.model('Swatch'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Swatch
 */
exports.create = function(req, res) {
	var swatch = new Swatch(req.body);
	swatch.user = req.user;

	swatch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(swatch);
		}
	});
};

/**
 * Show the current Swatch
 */
exports.read = function(req, res) {
	res.jsonp(req.swatch);
};

/**
 * Update a Swatch
 */
exports.update = function(req, res) {
	var swatch = req.swatch ;

	swatch = _.extend(swatch , req.body);

	swatch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(swatch);
		}
	});
};

/**
 * Delete an Swatch
 */
exports.delete = function(req, res) {
	var swatch = req.swatch ;

	swatch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(swatch);
		}
	});
};

/**
 * List of Swatches
 */
exports.list = function(req, res) { Swatch.find().sort('-created').populate('user', 'displayName').exec(function(err, swatches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(swatches);
		}
	});
};

/**
 * Swatch middleware
 */
exports.swatchByID = function(req, res, next, id) { Swatch.findById(id).populate('user', 'displayName').exec(function(err, swatch) {
		if (err) return next(err);
		if (! swatch) return next(new Error('Failed to load Swatch ' + id));
		req.swatch = swatch ;
		next();
	});
};