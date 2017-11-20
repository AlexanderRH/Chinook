(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeCard', mediaTypeCard);

    function mediaTypeCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                mediaTypeId: '@',
                name: '@'
            },
            templateUrl: 'app/private/media-type/directives/media-type-card/media-type-card.html'

        };
    }
})();
