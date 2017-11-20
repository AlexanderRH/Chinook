(function () {
    'use strict';
    angular.module('app')
        .directive('artistCard', artistCard);

    function artistCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                artistId: '@',
                name: '@'
            },
            templateUrl: 'app/private/artist/directives/artist-card/artist-card.html'

        };
    }
})();
