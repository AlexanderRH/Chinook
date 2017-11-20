(function () {
    'use strict';
    angular.module('app')
        .directive('genreForm', genreForm);
    function genreForm() {
        return {
            restrict: 'E',
            scope: {
                genre: '='
            },
            templateUrl: 'app/private/genre/directives/genre-form/genre-form.html'
        };
    }
})();