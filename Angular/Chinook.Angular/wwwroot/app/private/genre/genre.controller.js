﻿(function () {
    'use strict';
    angular.module('app')
        .controller('genreController', genreController);

    genreController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function genreController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.genre = {};
        vm.genreList = [];
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
        vm.getGenre = getGenre;
        vm.create = create;
        vm.edit = edit;
        vm.delete = genreDelete;
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
            dataService.getData(apiUrl + '/genre/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/genre/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.genreList = result.data;
                },
                function (error) {
                    vm.genreList = [];
                    console.log(error);
                });
        }

        function getGenre(id) {
            vm.genre = null;
            dataService.getData(apiUrl + '/genre/' + id)
                .then(function (result) {
                    vm.genre = result.data;
                },
                function (error) {
                    vm.genre = null;
                    console.log(error);
                });
        }

        function updateGenre() {
            if (!vm.genre) return;
            dataService.putData(apiUrl + '/genre', vm.genre)
                .then(function (result) {
                    vm.genre = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.genre = {};
                    console.log(error);
                });
        }

        function createGenre() {
            if (!vm.genre) return;
            dataService.postData(apiUrl + '/genre', vm.genre)
                .then(function (result) {
                    getGenre(result.data);
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

        function deleteGenre() {
            dataService.deleteData(apiUrl + '/genre/' + vm.genre.genreId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.genre = {};
            vm.modalTitle = 'Create Genre';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createGenre;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Genre';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateGenre;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Genre Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function genreDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Genre';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteGenre;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();