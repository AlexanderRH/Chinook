(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackCard', playlistTrackCard);

    function playlistTrackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                playlistTrackId: '@',
                playlistId: '@',
                trackId: '@'
            },
            templateUrl: 'app/private/playlist-track/directives/playlist-track-card/playlist-track-card.html'

        };
    }
})();
