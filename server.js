'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	mongoose = require('./config/lib/mongoose'),
	express = require('./config/lib/express');

// // Initialize mongoose
// mongoose.connect(function (db) {
// 	// Initialize express
// 	var app = express.init(db);
//
// 	// Start the app by listening on <port>
// 	app.listen(config.port);
//
// 	// Logging initialization
// 	console.log('MEAN.JS application started on port ' + config.port);
// });

mongoose.connect('mongodb://joshualshi@ymail.com:tHP;jls21815004285348@ds051843.mongolab.com:51843/heroku_4dpz1tzj');
