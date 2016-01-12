'use strict';

// Configuring the Swatches module
angular.module('swatches').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', {
			title: 'my swatches',
			state: 'swatches.list'
		});

		Menus.addMenuItem('topbar', {
			title: 'create swatch',
			state: 'swatches.create'
		});
	}
]);
