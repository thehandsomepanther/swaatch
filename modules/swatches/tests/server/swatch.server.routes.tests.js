'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Swatch = mongoose.model('Swatch'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, swatch;

/**
 * Swatch routes tests
 */
describe('Swatch CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Swatch
		user.save(function() {
			swatch = {
				name: 'Swatch Name'
			};

			done();
		});
	});

	it('should be able to save Swatch instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Swatch
				agent.post('/api/swatches')
					.send(swatch)
					.expect(200)
					.end(function(swatchSaveErr, swatchSaveRes) {
						// Handle Swatch save error
						if (swatchSaveErr) done(swatchSaveErr);

						// Get a list of Swatches
						agent.get('/api/swatches')
							.end(function(swatchesGetErr, swatchesGetRes) {
								// Handle Swatch save error
								if (swatchesGetErr) done(swatchesGetErr);

								// Get Swatches list
								var swatches = swatchesGetRes.body;

								// Set assertions
								(swatches[0].user._id).should.equal(userId);
								(swatches[0].name).should.match('Swatch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Swatch instance if not logged in', function(done) {
		agent.post('/api/swatches')
			.send(swatch)
			.expect(403)
			.end(function(swatchSaveErr, swatchSaveRes) {
				// Call the assertion callback
				done(swatchSaveErr);
			});
	});

	it('should not be able to save Swatch instance if no name is provided', function(done) {
		// Invalidate name field
		swatch.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Swatch
				agent.post('/api/swatches')
					.send(swatch)
					.expect(400)
					.end(function(swatchSaveErr, swatchSaveRes) {
						// Set message assertion
						(swatchSaveRes.body.message).should.match('Please fill Swatch name');
						
						// Handle Swatch save error
						done(swatchSaveErr);
					});
			});
	});

	it('should be able to update Swatch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Swatch
				agent.post('/api/swatches')
					.send(swatch)
					.expect(200)
					.end(function(swatchSaveErr, swatchSaveRes) {
						// Handle Swatch save error
						if (swatchSaveErr) done(swatchSaveErr);

						// Update Swatch name
						swatch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Swatch
						agent.put('/api/swatches/' + swatchSaveRes.body._id)
							.send(swatch)
							.expect(200)
							.end(function(swatchUpdateErr, swatchUpdateRes) {
								// Handle Swatch update error
								if (swatchUpdateErr) done(swatchUpdateErr);

								// Set assertions
								(swatchUpdateRes.body._id).should.equal(swatchSaveRes.body._id);
								(swatchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Swatches if not signed in', function(done) {
		// Create new Swatch model instance
		var swatchObj = new Swatch(swatch);

		// Save the Swatch
		swatchObj.save(function() {
			// Request Swatches
			request(app).get('/api/swatches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Swatch if not signed in', function(done) {
		// Create new Swatch model instance
		var swatchObj = new Swatch(swatch);

		// Save the Swatch
		swatchObj.save(function() {
			request(app).get('/api/swatches/' + swatchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', swatch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Swatch instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Swatch
				agent.post('/api/swatches')
					.send(swatch)
					.expect(200)
					.end(function(swatchSaveErr, swatchSaveRes) {
						// Handle Swatch save error
						if (swatchSaveErr) done(swatchSaveErr);

						// Delete existing Swatch
						agent.delete('/api/swatches/' + swatchSaveRes.body._id)
							.send(swatch)
							.expect(200)
							.end(function(swatchDeleteErr, swatchDeleteRes) {
								// Handle Swatch error error
								if (swatchDeleteErr) done(swatchDeleteErr);

								// Set assertions
								(swatchDeleteRes.body._id).should.equal(swatchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Swatch instance if not signed in', function(done) {
		// Set Swatch user 
		swatch.user = user;

		// Create new Swatch model instance
		var swatchObj = new Swatch(swatch);

		// Save the Swatch
		swatchObj.save(function() {
			// Try deleting Swatch
			request(app).delete('/api/swatches/' + swatchObj._id)
			.expect(403)
			.end(function(swatchDeleteErr, swatchDeleteRes) {
				// Set message assertion
				(swatchDeleteRes.body.message).should.match('User is not authorized');

				// Handle Swatch error error
				done(swatchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Swatch.remove().exec(function(){
				done();
			});
		});
	});
});
