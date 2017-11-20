(function () {
    'use strict';
    angular.module('app')
        .directive('invoiceLineCard', invoiceLineCard);

    function invoiceLineCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                invoiceLineId: '@',
                invoiceId: '@',
                trackId: '@',
                unitPrice: '@',
                quantity: '@'
            },
            templateUrl: 'app/private/invoice-line/directives/invoice-line-card/invoice-line-card.html'

        };
    }
})();
