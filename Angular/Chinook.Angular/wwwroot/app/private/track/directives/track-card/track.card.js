(function () {
    'use strict';
    angular.module('app')
        .directive('trackCard', trackCard);

    function trackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                trackId: '@',
                name: '@',
                albumId: '@',
                mediaTypeId: '@',
                genreId: '@',
                composer: '@',
                milliseconds: '@',
                bytes: '@',
                unitePrice: '@'
            },
            templateUrl: 'app/private/track/directives/track-card/track-card.html'

        };
    }
})();
