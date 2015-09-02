'use strict';

describe('Swatches E2E Tests:', function() {
	describe('Test Swatches page', function() {
		it('Should not include new Swatches', function() {
			browser.get('http://localhost:3000/#!/swatches');
			expect(element.all(by.repeater('swatch in swatches')).count()).toEqual(0);
		});
	});
});
