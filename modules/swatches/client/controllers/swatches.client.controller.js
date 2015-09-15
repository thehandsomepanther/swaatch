'use strict';

// Swatches controller
angular.module('swatches')
  .controller('SwatchesController', ['$scope', '$stateParams', '$location', '$interval', 'Authentication', 'Swatches',
    function($scope, $stateParams, $location, $interval, Authentication, Swatches) {
      $scope.minDate = new Date();
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

      // calculates delta for urgency and importance based on starting value and number of days until due
      // start does not call getTime() because it should always be Date.now()
      function calcDelta(start, due, initial) {
        var msDay = 60 * 60 * 24 * 1000;

        console.log(due);
        console.log(typeof due);

        return (100 - initial) / Math.ceil((due - start) / msDay);
      }

      // Create new Swatch
      $scope.create = function() {

        var due, i_delta, u_delta;

        if (this.due_date !== undefined) {
          due = this.due_date.getTime();
          i_delta = calcDelta(Date.now(), this.due_date.getTime(), this.importance);
          u_delta = calcDelta(Date.now(), this.due_date.getTime(), this.urgency);
        } else {
          due = null;
          i_delta = 0;
          u_delta = 0;
        }

        // Create new Swatch object
        var swatch = new Swatches({
          title: this.title,
          description: this.description,
          importance: this.importance,
          urgency: this.urgency,
          priority: calcPriority(this.urgency, this.importance),
          color: calcColor(this.urgency, this.importance),
          completed: this.completed,
          due_date: due,
          importance_delta: i_delta,
          urgency_delta: u_delta
        });

        // Redirect after save
        swatch.$save(function(response) {
          // $location.path('swatches/' + response._id);
          $location.path('swatches');
          // Clear form fields
          $scope.title = '';
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
        swatch.priority = calcPriority($scope.swatch.urgency, $scope.swatch.importance);
        swatch.color = calcColor($scope.swatch.urgency, $scope.swatch.importance);

        if (this.due_date) {
          swatch.due_date = this.due_date.getTime();

          swatch.importance_delta = calcDelta(Date.now(), swatch.due_date, swatch.importance);
          swatch.urgency_delta = calcDelta(Date.now(), swatch.due_date, swatch.urgency);
        }

        swatch.$update(function() {
          // $location.path('swatches/' + swatch._id);
          $location.path('swatches');
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.setCompleted = function(id, status) {
        $scope.swatch = Swatches.get({
          swatchId: id
        }, function() {
          var swatch = $scope.swatch;
          swatch.completed = status;

          swatch.$update(function(){

          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        });
      };

      $scope.listRemove = function(id) {
        $scope.swatch = Swatches.get({
          swatchId: id
        }, function() {
          var swatch = $scope.swatch;
          $scope.remove(swatch);
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

      // Find existing Swatch
      $scope.findOne = function(id) {
        if (id) {
          $scope.swatch = Swatches.get({
            swatchId: id
          });
        } else {
          $scope.swatch = Swatches.get({
            swatchId: $stateParams.swatchId
          });
        }
      };
    }
  ]);
