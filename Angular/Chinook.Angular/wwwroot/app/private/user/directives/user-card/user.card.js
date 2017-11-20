(function () {
    'use strict';
    angular.module('app')
        .directive('userCard', userCard);
    function userCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                email: '@',
                firstName: '@',
                lastName: '@',
                password: '@',
                roles: '@'
            },
            templateUrl: 'app/private/user/directives/user-card/user-card.html'
        };
    }
})();
