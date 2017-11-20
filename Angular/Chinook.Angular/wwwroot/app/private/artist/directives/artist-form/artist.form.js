(function () {
    'use strict';
    angular.module('app')
        .directive('artistForm', artistForm);
    function artistForm() {
        return {
            restrict: 'E',
            scope: {
                artist: '='
            },
            templateUrl: 'app/private/artist/directives/artist-form/artist-form.html'
        };
    }
})();