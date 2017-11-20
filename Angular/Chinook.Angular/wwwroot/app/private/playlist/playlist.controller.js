(function () {
    'use strict';
    angular.module('app')
        .controller('playlistController', playlistController);

    playlistController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function playlistController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.playlist = {};
        vm.playlistList = [];
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
        vm.getPlaylist = getPlaylist;
        vm.create = create;
        vm.edit = edit;
        vm.delete = playlistDelete;
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
            dataService.getData(apiUrl + '/playlist/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/playlist/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.playlistList = result.data;
                },
                function (error) {
                    vm.playlistList = [];
                    console.log(error);
                });
        }

        function getPlaylist(id) {
            vm.playlist = null;
            dataService.getData(apiUrl + '/playlist/' + id)
                .then(function (result) {
                    vm.playlist = result.data;
                },
                function (error) {
                    vm.playlist = null;
                    console.log(error);
                });
        }

        function updatePlaylist() {
            if (!vm.playlist) return;
            dataService.putData(apiUrl + '/playlist', vm.playlist)
                .then(function (result) {
                    vm.playlist = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.playlist = {};
                    console.log(error);
                });
        }

        function createPlaylist() {
            if (!vm.playlist) return;
            dataService.postData(apiUrl + '/playlist', vm.playlist)
                .then(function (result) {
                    getPlaylist(result.data);
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

        function deletePlaylist() {
            dataService.deleteData(apiUrl + '/playlist/' + vm.playlist.playlistId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.playlist = {};
            vm.modalTitle = 'Create Playlist';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createPlaylist;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Playlist';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updatePlaylist;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Playlist Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function playlistDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Playlist';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletePlaylist;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();