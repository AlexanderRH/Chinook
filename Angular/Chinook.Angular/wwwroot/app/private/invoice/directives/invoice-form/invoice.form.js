﻿(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceForm', invoiceForm);
    function invoiceForm() {
        return {
            restrict: 'E',
            scope: {
                invoice: '='
            },
            templateUrl: 'app/private/invoice/directives/invoice-form/invoice-form.html'
        };
    }
})();