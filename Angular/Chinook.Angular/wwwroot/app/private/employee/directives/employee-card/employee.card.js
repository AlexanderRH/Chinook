(function () {
    'use strict';
    angular.module('app')
        .directive('employeeCard', employeeCard);

    function employeeCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                employeeId: '@',
                firstName: '@',
                lastName: '@',
                title: '@',
                reportsTo: '@',
                birthDate: '@',
                hireDate: '@',
                address: '@',
                city: '@',
                state: '@',
                country: '@',
                postalCode: '@',
                phone: '@',
                fax: '@',
                email: '@'
            },
            templateUrl: 'app/private/employee/directives/employee-card/employee-card.html'

        };
    }
})();
