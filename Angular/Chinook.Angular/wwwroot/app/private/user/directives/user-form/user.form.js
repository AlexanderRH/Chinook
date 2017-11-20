(function () {
    'use strict';
    angular.module('app')
        .directive('userForm', userForm);
    function userForm() {
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            templateUrl: 'app/private/user/directives/user-form/user-form.html'
        };
    }
})();