﻿(function () {
    'use strict';
    angular.module('app')
        .controller('mediaTypeController', mediaTypeController);

    mediaTypeController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function mediaTypeController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.mediaType = {};
        vm.mediaTypeList = [];
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
        vm.getMediaType = getMediaType;
        vm.create = create;
        vm.edit = edit;
        vm.delete = mediaTypeDelete;
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
            dataService.getData(apiUrl + '/mediaType/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/mediaType/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.mediaTypeList = result.data;
                },
                function (error) {
                    vm.mediaTypeList = [];
                    console.log(error);
                });
        }

        function getMediaType(id) {
            vm.mediaType = null;
            dataService.getData(apiUrl + '/mediaType/' + id)
                .then(function (result) {
                    vm.mediaType = result.data;
                },
                function (error) {
                    vm.mediaType = null;
                    console.log(error);
                });
        }

        function updateMediaType() {
            if (!vm.mediaType) return;
            dataService.putData(apiUrl + '/mediaType', vm.mediaType)
                .then(function (result) {
                    vm.mediaType = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.mediaType = {};
                    console.log(error);
                });
        }

        function createMediaType() {
            if (!vm.mediaType) return;
            dataService.postData(apiUrl + '/mediaType', vm.mediaType)
                .then(function (result) {
                    getMediaType(result.data);
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

        function deleteMediaType() {
            dataService.deleteData(apiUrl + '/mediaType/' + vm.mediaType.mediaTypeId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.mediaType = {};
            vm.modalTitle = 'Create MediaType';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createMediaType;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit MediaType';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateMediaType;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New MediaType Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function mediaTypeDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete MediaType';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteMediaType;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();