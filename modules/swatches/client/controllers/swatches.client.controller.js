'use strict';

// Swatches controller
angular.module('swatches')
  .controller('SwatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Swatches',
    function($scope, $stateParams, $location, Authentication, Swatches) {
      $scope.authentication = Authentication;

      $scope.importance = 50;
      $scope.urgency = 50;

      $scope.show = 0;
      $scope.sort = '-priority';
      $scope.view = 'list';

      $scope.focus = null;
      $scope.has_swatches = true;

      // calculates hue from importance
      function parseHue(importance) {
        return (importance - 100) / 100 * 250;
      }

      // calculates brightness from urgency
      function parseBright(urgency) {
        return urgency / 2;
      }

      // calculates priority from importance and urgency
      function calcPriority(urgency, importance) {
        return Math.sqrt(urgency * urgency + importance * importance);
      }

      // calculates color from importance and urgency
      function calcColor(urgency, importance) {
        return 'hsla(' + parseHue(importance) + ', 100%, ' + parseBright(urgency) + '%, 1)';
      }

      // Create new Swatch
      $scope.create = function() {
        // Create new Swatch object
        var swatch = new Swatches({
          title: this.title,
          description: this.description,
          importance: this.importance,
          urgency: this.urgency,
          priority: calcPriority(this.urgency, this.importance),
          color: calcColor(this.urgency, this.importance),
          completed: this.completed
        });

        // Redirect after save
        swatch.$save(function(response) {
          $location.path('swatches/' + response._id);

          // Clear form fields
          $scope.name = '';
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Remove existing Swatch
      $scope.remove = function(swatch) {
        if (swatch) {
          swatch.$remove();

          for (var i in $scope.swatches) {
            if ($scope.swatches[i] === swatch) {
              $scope.swatches.splice(i, 1);
            }
          }
        } else {
          $scope.swatch.$remove(function() {
            $location.path('swatches');
          });
        }
      };

      // Update existing Swatch
      $scope.update = function() {
        var swatch = $scope.swatch;
        swatch.priority = Math.sqrt(Math.pow($scope.swatch.importance, 2) + Math.pow($scope.swatch.urgency, 2));

        swatch.$update(function() {
          $location.path('swatches/' + swatch._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Update focus Swatch
      $scope.updateFocus = function() {
        var swatch = $scope.focus;
        swatch.priority = Math.sqrt(Math.pow($scope.focus.importance, 2) + Math.pow($scope.focus.urgency, 2));

        swatch.$update(function() {

        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Find a list of Swatches
      $scope.find = function() {
        $scope.swatches = Swatches.query();
      };

      $scope.hasSwatch = function() {
        $scope.has_swatches = Swatches.get({
          userId: $stateParams.userId
        });
      };

      // Find existing Swatch
      $scope.findOne = function() {
        $scope.swatch = Swatches.get({
          swatchId: $stateParams.swatchId
        });
      };
    }
  ]);
