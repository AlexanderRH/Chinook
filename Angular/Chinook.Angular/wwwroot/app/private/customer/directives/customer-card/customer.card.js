(function () {
    'use strict';
    angular.module('app')
        .directive('customerCard', customerCard);

    function customerCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                customerId: '@',
                firstName: '@',
                lastName: '@',
                company: '@',
                address: '@',
                city: '@',
                state: '@',
                country: '@',
                postalCode: '@',
                phone: '@',
                fax: '@',
                email: '@',
                supportRepId: '@'
            },
            templateUrl: 'app/private/customer/directives/customer-card/customer-card.html'

        };
    }
})();
