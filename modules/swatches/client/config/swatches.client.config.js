'use strict';

// Configuring the Swatches module
angular.module('swatches').run(['Menus',
	function(Menus) {
		// Add the Swatches dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Swatches',
			state: 'swatches',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'swatches', {
			title: 'List Swatches',
			state: 'swatches.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'swatches', {
			title: 'Create Swatch',
			state: 'swatches.create'
		});
	}
]);