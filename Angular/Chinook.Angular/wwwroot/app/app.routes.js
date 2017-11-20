(function () {
    'use strict';

    angular.module('app').config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "app/home.html"
            })
            .state("login", {
                url: "/login",
                templateUrl: "app/public/login/index.html"
            })
            .state("album", {
                url: "/album",
                templateUrl: 'app/private/album/index.html'
            })
            .state("artist", {
                url: "/artist",
                templateUrl: 'app/private/artist/index.html'
            })
            .state("customer", {
                url: "/customer",
                templateUrl: 'app/private/customer/index.html'
            })
            .state("employee", {
                url: "/employee",
                templateUrl: 'app/private/employee/index.html'
            })
            .state("genre", {
                url: "/genre",
                templateUrl: 'app/private/genre/index.html'
            })
            .state("invoice", {
                url: "/invoice",
                templateUrl: 'app/private/invoice/index.html'
            })
            .state("invoiceLine", {
                url: "/invoiceLine",
                templateUrl: 'app/private/invoice-line/index.html'
            })
            .state("mediaType", {
                url: "/mediaType",
                templateUrl: 'app/private/media-type/index.html'
            })
            .state("playlist", {
                url: "/playlist",
                templateUrl: 'app/private/playlist/index.html'
            })
            .state("playlistTrack", {
                url: "/playlistTrack",
                templateUrl: 'app/private/playlist-Track/index.html'
            })
            .state("track", {
                url: "/track",
                templateUrl: 'app/private/track/index.html'
            })
            .state("user", {
                url: "/user",
                templateUrl: 'app/private/user/index.html'
            })
            .state("otherwise", {
                url: "/",
                templateUrl: "app/home.html"
            })
    }
})();