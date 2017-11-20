(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceLineForm', invoiceLineForm);
    function invoiceLineForm() {
        return {
            restrict: 'E',
            scope: {
                invoiceLine: '='
            },
            templateUrl: 'app/private/invoice-line/directives/invoice-line-form/invoice-line-form.html'
        };
    }
})();