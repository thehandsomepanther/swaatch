'use strict';

//Setting up route
angular.module('swatches').config(['$stateProvider',
	function($stateProvider) {
		// Swatches state routing
		$stateProvider.
		state('swatches', {
			abstract: true,
			url: '/swatches',
			template: '<ui-view/>'
		}).
		state('swatches.list', {
			url: '',
			templateUrl: 'modules/swatches/views/list-swatches.client.view.html'
		}).
		state('swatches.create', {
			url: '/create',
			templateUrl: 'modules/swatches/views/create-swatch.client.view.html'
		}).
		state('swatches.view', {
			url: '/:swatchId',
			templateUrl: 'modules/swatches/views/view-swatch.client.view.html'
		}).
		state('swatches.edit', {
			url: '/:swatchId/edit',
			templateUrl: 'modules/swatches/views/edit-swatch.client.view.html'
		});
	}
]);