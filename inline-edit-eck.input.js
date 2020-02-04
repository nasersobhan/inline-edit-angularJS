(function () {
  'use strict';

  var app = angular.module('inlineEditInput', ['angular-drupal', 'user', 'angular.filter', 'labelpanel', 'colorbox', 'xeditable']);

  app.directive('inlineEdit', function ($timeout, RestResource) {
    return {
      scope: {
        model: '=inlineEdit',
        handleSave: '&onSave',
        handleCancel: '&onCancel'
      },
      link: function (scope, elm, attr, $injector) {
        var previousValue;
        scope.edit = function () {
          scope.editMode = true;
          //Save the previous value before changeing.
          previousValue = scope.model;

          $timeout(function () {
            elm.find('input')[0].focus();
          }, 0, false);
        };
        scope.save = function () {
          //check if there was actully a change.
          if (scope.model != previousValue) {
            //create the request data
            var field_name = attr.fieldname
            var PushData = {};
            PushData[field_name] = scope.model
            // Drupal API Send requrest.
            RestResource.UpdateDatabase(attr.entity, attr.bundle, attr.valueid, PushData).then(function (res) {
              // Update View.
              scope.handleCancel({ value: scope.model });
              // Hide Input.
              scope.editMode = false;
            });
          } else {
            scope.handleCancel({ value: scope.model });
            scope.editMode = false;
          }
        };
        scope.cancel = function () {
          scope.editMode = false;
          scope.model = previousValue;
          scope.handleCancel({ value: scope.model });
        };
      },
      templateUrl: 'app/src/components/inline-edit/inline-edit-eck.input.html'
    };
  });

  app.directive('onEnter', function () {
    return function (scope, elm, attr) {
      elm.bind('keypress', function (e) {
        if (e.keyCode === 13) {
          scope.$apply(attr.onEnter);
        }
      });
    };
  });

  app.directive('onEsc', function () {
    return function (scope, elm, attr) {
      elm.bind('keydown', function (e) {
        if (e.keyCode === 27) {
          scope.$apply(attr.onEsc);
        }
      });
    };
  });


})();