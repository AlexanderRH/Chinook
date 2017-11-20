(function () {
    'use strict';
    angular.module('app')
        .directive('employeeForm', employeeForm);
    function employeeForm() {
        return {
            restrict: 'E',
            scope: {
                employee: '='
            },
            templateUrl: 'app/private/employee/directives/employee-form/employee-form.html'
        };
    }
})();