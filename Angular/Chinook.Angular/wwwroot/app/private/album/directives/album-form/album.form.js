(function () {
    'use strict';
    angular.module('app')
        .directive('albumForm', albumForm);
    function albumForm() {
        return {
            restrict: 'E',
            scope: {
                album: '='
            },
            templateUrl: 'app/private/album/directives/album-form/album-form.html'
        };
    }
})();