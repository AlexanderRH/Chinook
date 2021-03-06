﻿(function () {
    'use strict';
    angular.module('app')
        .controller('invoiceController', invoiceController);

    invoiceController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function invoiceController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.invoice = {};
        vm.invoiceList = [];
        vm.modalButtonTitle = '';
        vm.readOnly = false;
        vm.isDelete = false;
        vm.modalTitle = '';
        vm.showCreate = false;
        vm.totalRecords = 0;
        vm.currentPage = 1;
        vm.maxSize = 10;
        vm.itemsPerPage = 30;

        //Funciones
        vm.getInvoice = getInvoice;
        vm.create = create;
        vm.edit = edit;
        vm.delete = invoiceDelete;
        vm.pageChanged = pageChanged;
        vm.closeModal = closeModal;
        init();

        function init() {
            if (!configService.getLogin()) return $state.go('login');
            configurePagination()
        }

        function configurePagination() {
            //In case mobile just show 5 pages
            var widthScreen = (window.innerWidth > 0) ? window.innerWidth : screen.width;

            if (widthScreen < 420) vm.maxSize = 5;

            totalRecords();
        }

        function pageChanged() {
            getPageRecords(vm.currentPage);
        }

        function totalRecords() {
            dataService.getData(apiUrl + '/invoice/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/invoice/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.invoiceList = result.data;
                },
                function (error) {
                    vm.invoiceList = [];
                    console.log(error);
                });
        }

        function getInvoice(id) {
            vm.invoice = null;
            dataService.getData(apiUrl + '/invoice/' + id)
                .then(function (result) {
                    vm.invoice = result.data;
                },
                function (error) {
                    vm.invoice = null;
                    console.log(error);
                });
        }

        function updateInvoice() {
            if (!vm.invoice) return;
            dataService.putData(apiUrl + '/invoice', vm.invoice)
                .then(function (result) {
                    vm.invoice = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.invoice = {};
                    console.log(error);
                });
        }

        function createInvoice() {
            if (!vm.invoice) return;
            dataService.postData(apiUrl + '/invoice', vm.invoice)
                .then(function (result) {
                    getInvoice(result.data);
                    detail();
                    getPageRecords(1);
                    vm.currentPage = 1;
                    vm.showCreate = true;
                },
                function (error) {
                    console.log(error);
                    closeModal();
                });
        }

        function deleteInvoice() {
            dataService.deleteData(apiUrl + '/invoice/' + vm.invoice.invoiceId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.invoice = {};
            vm.modalTitle = 'Create Invoice';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createInvoice;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Invoice';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateInvoice;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Invoice Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function invoiceDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Invoice';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteInvoice;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();