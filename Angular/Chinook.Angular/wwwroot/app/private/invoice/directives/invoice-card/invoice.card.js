(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceCard', invoiceCard);

    function invoiceCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                invoiceId: '@',
                customerId: '@',
                invoiceDate: '@',
                billingAddress: '@',
                billingCity: '@',
                billingState: '@',
                billingCountry: '@',
                billingPostalCode: '@',
                total: '@'
            },
            templateUrl: 'app/private/invoice/directives/invoice-card/invoice-card.html'

        };
    }
})();
