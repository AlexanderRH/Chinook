(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeForm', mediaTypeForm);
    function mediaTypeForm() {
        return {
            restrict: 'E',
            scope: {
                mediaType: '='
            },
            templateUrl: 'app/private/media-type/directives/media-type-form/media-type-form.html'
        };
    }
})();