'use strict';

(function() {
	// Swatches Controller Spec
	describe('Swatches Controller Tests', function() {
		// Initialize global variables
		var SwatchesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Swatches controller.
			SwatchesController = $controller('SwatchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Swatch object fetched from XHR', inject(function(Swatches) {
			// Create sample Swatch using the Swatches service
			var sampleSwatch = new Swatches({
				name: 'New Swatch'
			});

			// Create a sample Swatches array that includes the new Swatch
			var sampleSwatches = [sampleSwatch];

			// Set GET response
			$httpBackend.expectGET('api/swatches').respond(sampleSwatches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.swatches).toEqualData(sampleSwatches);
		}));

		it('$scope.findOne() should create an array with one Swatch object fetched from XHR using a swatchId URL parameter', inject(function(Swatches) {
			// Define a sample Swatch object
			var sampleSwatch = new Swatches({
				name: 'New Swatch'
			});

			// Set the URL parameter
			$stateParams.swatchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/swatches\/([0-9a-fA-F]{24})$/).respond(sampleSwatch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.swatch).toEqualData(sampleSwatch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Swatches) {
			// Create a sample Swatch object
			var sampleSwatchPostData = new Swatches({
				name: 'New Swatch'
			});

			// Create a sample Swatch response
			var sampleSwatchResponse = new Swatches({
				_id: '525cf20451979dea2c000001',
				name: 'New Swatch'
			});

			// Fixture mock form input values
			scope.name = 'New Swatch';

			// Set POST response
			$httpBackend.expectPOST('api/swatches', sampleSwatchPostData).respond(sampleSwatchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Swatch was created
			expect($location.path()).toBe('/swatches/' + sampleSwatchResponse._id);
		}));

		it('$scope.update() should update a valid Swatch', inject(function(Swatches) {
			// Define a sample Swatch put data
			var sampleSwatchPutData = new Swatches({
				_id: '525cf20451979dea2c000001',
				name: 'New Swatch'
			});

			// Mock Swatch in scope
			scope.swatch = sampleSwatchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/swatches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/swatches/' + sampleSwatchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid swatchId and remove the Swatch from the scope', inject(function(Swatches) {
			// Create new Swatch object
			var sampleSwatch = new Swatches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Swatches array and include the Swatch
			scope.swatches = [sampleSwatch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/swatches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSwatch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.swatches.length).toBe(0);
		}));
	});
}());