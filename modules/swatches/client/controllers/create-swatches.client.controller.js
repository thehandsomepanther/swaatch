'use strict'

// create swatches controller
angular.module('swatches')
  .controller('CreateSwatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Swatches',
    function($scope, $stateParams, $location, Authentication, Swatches) {
      $scope.importance = 50;
      $scope.urgency = 50;


    });
