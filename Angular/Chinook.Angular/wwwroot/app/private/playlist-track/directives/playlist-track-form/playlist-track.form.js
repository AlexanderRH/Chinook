(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackForm', playlistTrackForm);
    function playlistTrackForm() {
        return {
            restrict: 'E',
            scope: {
                playlistTrack: '='
            },
            templateUrl: 'app/private/playlist-track/directives/playlist-track-form/playlist-track-form.html'
        };
    }
})();