'use strict';

//Swatches service used to communicate Swatches REST endpoints
angular.module('swatches').factory('Swatches', ['$resource',
	function($resource) {
		return $resource('api/swatches/:swatchId', { swatchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);