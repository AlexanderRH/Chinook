(function () {
    'use strict';
    angular.module('app')
        .controller('artistController', artistController);

    artistController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function artistController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.artist = {};
        vm.artistList = [];
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
        vm.getArtist = getArtist;
        vm.create = create;
        vm.edit = edit;
        vm.delete = artistDelete;
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
            dataService.getData(apiUrl + '/artist/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/artist/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.artistList = result.data;
                },
                function (error) {
                    vm.artistList = [];
                    console.log(error);
                });
        }

        function getArtist(id) {
            vm.artist = null;
            dataService.getData(apiUrl + '/artist/' + id)
                .then(function (result) {
                    vm.artist = result.data;
                },
                function (error) {
                    vm.artist = null;
                    console.log(error);
                });
        }

        function updateArtist() {
            if (!vm.artist) return;
            dataService.putData(apiUrl + '/artist', vm.artist)
                .then(function (result) {
                    vm.artist = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.artist = {};
                    console.log(error);
                });
        }

        function createArtist() {
            if (!vm.artist) return;
            dataService.postData(apiUrl + '/artist', vm.artist)
                .then(function (result) {
                    getArtist(result.data);
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

        function deleteArtist() {
            dataService.deleteData(apiUrl + '/artist/' + vm.artist.artistId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.artist = {};
            vm.modalTitle = 'Create Artist';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createArtist;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Artist';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateArtist;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Artist Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function artistDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Artist';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteArtist;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();