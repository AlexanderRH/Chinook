(function () {
    angular.module('app')
        .directive('modalPanel', modalPanel);

    function modalPanel() {
        return {
            templateUrl: 'app/components/modal/modal-directive.html',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@',
                buttonTitle: '@',
                saveFunction: '=',
                closeFunction: '=',
                readOnly: '=',
                isDelete: '='
            }
        };
    }
})();
(function () {
    angular
        .module('app')
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', '$state', 'localStorageService', 'configService', '$q'];

    function authenticationService($http, $state, localStorageService, configService, $q) {
        var service = {};
        service.login = login;
        service.logout = logout;

        return service;

        function login(user) {
            var defer = $q.defer();
            var url = configService.getApiUrl() + '/Token';
            $http.post(url, user)
                .then(function (result) {
                    localStorageService.set('userToken',
                        {
                            token: result.data.access_Token,
                            userName: user.userName
                        });
                    configService.setLogin(true);
                    defer.resolve(true);
                },
                function (error) {
                    defer.reject(false);
                });

            return defer.promise;
        }

        function logout() {
            localStorageService.remove('userToken');
            configService.setLogin(false);
        }
    }
})();
(function () {
    angular
        .module('app')
        .factory('dataService', dataService);

    dataService.$inject = ["$http"];

    function dataService($http) {
        var service = {}

        service.getData = getData;
        service.postData = postData;
        service.putData = putData;
        service.deleteData = deleteData;

        return service;

        function getData(url) {
            return $http.get(url);
        }

        function postData(url, data) {
            return $http.post(url, data);
        }

        function putData(url, data) {
            return $http.put(url, data);
        }

        function deleteData(url) {
            return $http.delete(url);
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('configService', configService);

    function configService() {
        var service = {};
        var apiUrl = undefined;
        var isLogged = false;
        service.setLogin = setLogin;
        service.getLogin = getLogin;
        service.setApiUrl = setApiUrl;
        service.getApiUrl = getApiUrl;

        return service;

        function setLogin(state) {
            isLogged = state;
        }

        function getLogin() {
            return isLogged;
        }

        function setApiUrl(url) {
            apiUrl = url
        }

        function getApiUrl() {
            return apiUrl;
        }
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('albumController', albumController);

    albumController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function albumController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.album = {};
        vm.albumList = [];
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
        vm.getAlbum = getAlbum;
        vm.create = create;
        vm.edit = edit;
        vm.delete = albumDelete;
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
            dataService.getData(apiUrl + '/album/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/album/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.albumList = result.data;
                },
                function (error) {
                    vm.albumList = [];
                    console.log(error);
                });
        }

        function getAlbum(id) {
            vm.album = null;
            dataService.getData(apiUrl + '/album/' + id)
                .then(function (result) {
                    vm.album = result.data;
                },
                function (error) {
                    vm.album = null;
                    console.log(error);
                });
        }

        function updateAlbum() {
            if (!vm.album) return;
            dataService.putData(apiUrl + '/album', vm.album)
                .then(function (result) {
                    vm.album = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.album = {};
                    console.log(error);
                });
        }

        function createAlbum() {
            if (!vm.album) return;
            dataService.postData(apiUrl + '/album', vm.album)
                .then(function (result) {
                    getAlbum(result.data);
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

        function deleteAlbum() {
            dataService.deleteData(apiUrl + '/album/' + vm.album.albumId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.album = {};
            vm.modalTitle = 'Create Album';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createAlbum;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Album';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateAlbum;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Album Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function albumDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Album';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteAlbum;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .directive('albumCard', albumCard);

    function albumCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                albumId: '@',
                title: '@',
                artistId: '@'
            },
            templateUrl: 'app/private/album/directives/album-card/album-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('albumForm', albumForm);
    function albumForm() {
        return {
            restrict: 'E',
            scope: {
                album: '='
            },
            templateUrl: 'app/private/album/directives/album-form/album-form.html'
        };
    }
})();
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
(function () {
    'use strict';
    angular.module('app')
        .directive('artistCard', artistCard);

    function artistCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                artistId: '@',
                name: '@'
            },
            templateUrl: 'app/private/artist/directives/artist-card/artist-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('artistForm', artistForm);
    function artistForm() {
        return {
            restrict: 'E',
            scope: {
                artist: '='
            },
            templateUrl: 'app/private/artist/directives/artist-form/artist-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', customerController);

    customerController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function customerController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.customer = {};
        vm.customerList = [];
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
        vm.getCustomer = getCustomer;
        vm.create = create;
        vm.edit = edit;
        vm.delete = customerDelete;
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
            dataService.getData(apiUrl + '/customer/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/customer/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.customerList = result.data;
                },
                function (error) {
                    vm.customerList = [];
                    console.log(error);
                });
        }

        function getCustomer(id) {
            vm.customer = null;
            dataService.getData(apiUrl + '/customer/' + id)
                .then(function (result) {
                    vm.customer = result.data;
                },
                function (error) {
                    vm.customer = null;
                    console.log(error);
                });
        }

        function updateCustomer() {
            if (!vm.customer) return;
            dataService.putData(apiUrl + '/customer', vm.customer)
                .then(function (result) {
                    vm.customer = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.customer = {};
                    console.log(error);
                });
        }

        function createCustomer() {
            if (!vm.customer) return;
            dataService.postData(apiUrl + '/customer', vm.customer)
                .then(function (result) {
                    getCustomer(result.data);
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

        function deleteCustomer() {
            dataService.deleteData(apiUrl + '/customer/' + vm.customer.customerId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.customer = {};
            vm.modalTitle = 'Create Customer';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createCustomer;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Customer';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateCustomer;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Customer Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function customerDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Customer';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteCustomer;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
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

(function () {
    'use strict';
    angular.module('app')
        .directive('customerForm', customerForm);
    function customerForm() {
        return {
            restrict: 'E',
            scope: {
                customer: '='
            },
            templateUrl: 'app/private/customer/directives/customer-form/customer-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('employeeController', employeeController);

    employeeController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function employeeController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.employee = {};
        vm.employeeList = [];
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
        vm.getEmployee = getEmployee;
        vm.create = create;
        vm.edit = edit;
        vm.delete = employeeDelete;
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
            dataService.getData(apiUrl + '/employee/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/employee/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.employeeList = result.data;
                },
                function (error) {
                    vm.employeeList = [];
                    console.log(error);
                });
        }

        function getEmployee(id) {
            vm.employee = null;
            dataService.getData(apiUrl + '/employee/' + id)
                .then(function (result) {
                    vm.employee = result.data;
                },
                function (error) {
                    vm.employee = null;
                    console.log(error);
                });
        }

        function updateEmployee() {
            if (!vm.employee) return;
            dataService.putData(apiUrl + '/employee', vm.employee)
                .then(function (result) {
                    vm.employee = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.employee = {};
                    console.log(error);
                });
        }

        function createEmployee() {
            if (!vm.employee) return;
            dataService.postData(apiUrl + '/employee', vm.employee)
                .then(function (result) {
                    getEmployee(result.data);
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

        function deleteEmployee() {
            dataService.deleteData(apiUrl + '/employee/' + vm.employee.employeeId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.employee = {};
            vm.modalTitle = 'Create Employee';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createEmployee;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Employee';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateEmployee;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Employee Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function employeeDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Employee';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteEmployee;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .directive('employeeCard', employeeCard);

    function employeeCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                employeeId: '@',
                firstName: '@',
                lastName: '@',
                title: '@',
                reportsTo: '@',
                birthDate: '@',
                hireDate: '@',
                address: '@',
                city: '@',
                state: '@',
                country: '@',
                postalCode: '@',
                phone: '@',
                fax: '@',
                email: '@'
            },
            templateUrl: 'app/private/employee/directives/employee-card/employee-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('employeeForm', employeeForm);
    function employeeForm() {
        return {
            restrict: 'E',
            scope: {
                employee: '='
            },
            templateUrl: 'app/private/employee/directives/employee-form/employee-form.html'
        };
    }
})();
(function () {
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
(function () {
    'use strict';
    angular.module('app')
        .directive('genreCard', genreCard);

    function genreCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                genreId: '@',
                name: '@'
            },
            templateUrl: 'app/private/genre/directives/genre-card/genre-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('genreForm', genreForm);
    function genreForm() {
        return {
            restrict: 'E',
            scope: {
                genre: '='
            },
            templateUrl: 'app/private/genre/directives/genre-form/genre-form.html'
        };
    }
})();
(function () {
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

(function () {
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
(function () {
    'use strict';
    angular.module('app')
        .controller('invoiceLineController', invoiceLineController);

    invoiceLineController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function invoiceLineController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.invoiceLine = {};
        vm.invoiceLineList = [];
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
        vm.getInvoiceLine = getInvoiceLine;
        vm.create = create;
        vm.edit = edit;
        vm.delete = invoiceLineDelete;
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
            dataService.getData(apiUrl + '/invoiceLine/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/invoiceLine/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.invoiceLineList = result.data;
                },
                function (error) {
                    vm.invoiceLineList = [];
                    console.log(error);
                });
        }

        function getInvoiceLine(id) {
            vm.invoiceLine = null;
            dataService.getData(apiUrl + '/invoiceLine/' + id)
                .then(function (result) {
                    vm.invoiceLine = result.data;
                },
                function (error) {
                    vm.invoiceLine = null;
                    console.log(error);
                });
        }

        function updateInvoiceLine() {
            if (!vm.invoiceLine) return;
            dataService.putData(apiUrl + '/invoiceLine', vm.invoiceLine)
                .then(function (result) {
                    vm.invoiceLine = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.invoiceLine = {};
                    console.log(error);
                });
        }

        function createInvoiceLine() {
            if (!vm.invoiceLine) return;
            dataService.postData(apiUrl + '/invoiceLine', vm.invoiceLine)
                .then(function (result) {
                    getInvoiceLine(result.data);
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

        function deleteInvoiceLine() {
            dataService.deleteData(apiUrl + '/invoiceLine/' + vm.invoiceLine.invoiceLineId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.invoiceLine = {};
            vm.modalTitle = 'Create InvoiceLine';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createInvoiceLine;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit InvoiceLine';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateInvoiceLine;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New InvoiceLine Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function invoiceLineDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete InvoiceLine';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteInvoiceLine;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
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
(function () {
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
(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeCard', mediaTypeCard);

    function mediaTypeCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                mediaTypeId: '@',
                name: '@'
            },
            templateUrl: 'app/private/media-type/directives/media-type-card/media-type-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('mediaTypeForm', mediaTypeForm);
    function mediaTypeForm() {
        return {
            restrict: 'E',
            scope: {
                mediaType: '='
            },
            templateUrl: 'app/private/media-type/directives/media-type-form/media-type-form.html'
        };
    }
})();
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
(function () {
    'use strict';
    angular.module('app')
        .directive('playlistCard', playlistCard);

    function playlistCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                playlistId: '@',
                name: '@'
            },
            templateUrl: 'app/private/playlist/directives/playlist-card/playlist-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('playlistForm', playlistForm);
    function playlistForm() {
        return {
            restrict: 'E',
            scope: {
                playlist: '='
            },
            templateUrl: 'app/private/playlist/directives/playlist-form/playlist-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('playlistTrackController', playlistTrackController);

    playlistTrackController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function playlistTrackController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.playlistTrack = {};
        vm.playlistTrackList = [];
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
        vm.getPlaylistTrack = getPlaylistTrack;
        vm.create = create;
        vm.edit = edit;
        vm.delete = playlistTrackDelete;
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
            dataService.getData(apiUrl + '/playlistTrack/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/playlistTrack/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.playlistTrackList = result.data;
                },
                function (error) {
                    vm.playlistTrackList = [];
                    console.log(error);
                });
        }

        function getPlaylistTrack(id) {
            vm.playlistTrack = null;
            dataService.getData(apiUrl + '/playlistTrack/' + id)
                .then(function (result) {
                    vm.playlistTrack = result.data;
                },
                function (error) {
                    vm.playlistTrack = null;
                    console.log(error);
                });
        }

        function updatePlaylistTrack() {
            if (!vm.playlistTrack) return;
            dataService.putData(apiUrl + '/playlistTrack', vm.playlistTrack)
                .then(function (result) {
                    vm.playlistTrack = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.playlistTrack = {};
                    console.log(error);
                });
        }

        function createPlaylistTrack() {
            if (!vm.playlistTrack) return;
            dataService.postData(apiUrl + '/playlistTrack', vm.playlistTrack)
                .then(function (result) {
                    getPlaylistTrack(result.data);
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

        function deletePlaylistTrack() {
            dataService.deleteData(apiUrl + '/playlistTrack/' + vm.playlistTrack.playlistTrackId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.playlistTrack = {};
            vm.modalTitle = 'Create PlaylistTrack';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createPlaylistTrack;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit PlaylistTrack';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updatePlaylistTrack;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New PlaylistTrack Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function playlistTrackDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete PlaylistTrack';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deletePlaylistTrack;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackCard', playlistTrackCard);

    function playlistTrackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                playlistTrackId: '@',
                playlistId: '@',
                trackId: '@'
            },
            templateUrl: 'app/private/playlist-track/directives/playlist-track-card/playlist-track-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('playlistTrackForm', playlistTrackForm);
    function playlistTrackForm() {
        return {
            restrict: 'E',
            scope: {
                playlistTrack: '='
            },
            templateUrl: 'app/private/playlist-track/directives/playlist-track-form/playlist-track-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('trackController', trackController);

    trackController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function trackController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.track = {};
        vm.trackList = [];
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
        vm.getTrack = getTrack;
        vm.create = create;
        vm.edit = edit;
        vm.delete = trackDelete;
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
            dataService.getData(apiUrl + '/track/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/track/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.trackList = result.data;
                },
                function (error) {
                    vm.trackList = [];
                    console.log(error);
                });
        }

        function getTrack(id) {
            vm.track = null;
            dataService.getData(apiUrl + '/track/' + id)
                .then(function (result) {
                    vm.track = result.data;
                },
                function (error) {
                    vm.track = null;
                    console.log(error);
                });
        }

        function updateTrack() {
            if (!vm.track) return;
            dataService.putData(apiUrl + '/track', vm.track)
                .then(function (result) {
                    vm.track = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.track = {};
                    console.log(error);
                });
        }

        function createTrack() {
            if (!vm.track) return;
            dataService.postData(apiUrl + '/track', vm.track)
                .then(function (result) {
                    getTrack(result.data);
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

        function deleteTrack() {
            dataService.deleteData(apiUrl + '/track/' + vm.track.trackId)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.track = {};
            vm.modalTitle = 'Create Track';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createTrack;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit Track';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateTrack;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New Track Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function trackDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete Track';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteTrack;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .directive('trackCard', trackCard);

    function trackCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                trackId: '@',
                name: '@',
                albumId: '@',
                mediaTypeId: '@',
                genreId: '@',
                composer: '@',
                milliseconds: '@',
                bytes: '@',
                unitePrice: '@'
            },
            templateUrl: 'app/private/track/directives/track-card/track-card.html'

        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('trackForm', trackForm);
    function trackForm() {
        return {
            restrict: 'E',
            scope: {
                track: '='
            },
            templateUrl: 'app/private/track/directives/track-form/track-form.html'
        };
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .controller('userController', userController);

    userController.$inject = ['dataService', 'configService', '$state', '$scope'];
    function userController(dataService, configService, $state, $scope) {
        var apiUrl = configService.getApiUrl();
        var vm = this;

        //Propiedades
        vm.user = {};
        vm.userList = [];
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
        vm.getUser = getUser;
        vm.create = create;
        vm.edit = edit;
        vm.delete = userDelete;
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
            dataService.getData(apiUrl + '/user/count')
                .then(function (result) {
                    vm.totalRecords = result.data;
                    getPageRecords(vm.currentPage);
                }
                , function (error) {
                    console.log(error);
                });
        }

        function getPageRecords(page) {
            dataService.getData(apiUrl + '/user/list/' + page + '/' + vm.itemsPerPage)
                .then(function (result) {
                    vm.userList = result.data;
                },
                function (error) {
                    vm.userList = [];
                    console.log(error);
                });
        }

        function getUser(id) {
            vm.user = null;
            dataService.getData(apiUrl + '/user/' + id)
                .then(function (result) {
                    vm.user = result.data;
                },
                function (error) {
                    vm.user = null;
                    console.log(error);
                });
        }

        function updateUser() {
            if (!vm.user) return;

            dataService.putData(apiUrl + '/user', vm.user)
                .then(function (result) {
                    vm.user = {};
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    vm.user = {};
                    console.log(error);
                });
        }

        function createUser() {
            if (!vm.user) return;
            dataService.postData(apiUrl + '/user', vm.user)
                .then(function (result) {
                    getUser(result.data);
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

        function deleteUser() {
            dataService.deleteData(apiUrl + '/user/' + vm.user.id)
                .then(function (result) {
                    getPageRecords(vm.currentPage);
                    closeModal();
                },
                function (error) {
                    console.log(error);
                });
        }

        function create() {
            vm.user = {};
            vm.modalTitle = 'Create User';
            vm.modalButtonTitle = 'Create';
            vm.readOnly = false;
            vm.modalFunction = createUser;
            vm.isDelete = false;
        }

        function edit() {
            vm.showCreate = false;
            vm.modalTitle = 'Edit User';
            vm.modalButtonTitle = 'Update';
            vm.readOnly = false;
            vm.modalFunction = updateUser;
            vm.isDelete = false;
        }

        function detail() {
            vm.modalTitle = 'The New User Created';
            vm.modalButtonTitle = '';
            vm.readOnly = true;
            vm.modalFunction = null;
            vm.isDelete = false;
        }

        function userDelete() {
            vm.showCreate = false;
            vm.modalTitle = 'Delete User';
            vm.modalButtonTitle = 'Delete';
            vm.readOnly = false;
            vm.modalFunction = deleteUser;
            vm.isDelete = true;
        }

        function closeModal() {
            angular.element('#modal-container').modal('hide');
        }
    }
})();
(function () {
    'use strict';
    angular.module('app')
        .directive('userCard', userCard);
    function userCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                email: '@',
                firstName: '@',
                lastName: '@',
                password: '@',
                roles: '@'
            },
            templateUrl: 'app/private/user/directives/user-card/user-card.html'
        };
    }
})();

(function () {
    'use strict';
    angular.module('app')
        .directive('userForm', userForm);
    function userForm() {
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            templateUrl: 'app/private/user/directives/user-form/user-form.html'
        };
    }
})();
(function () {
	'use strict';

	angular.module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$http', 'authenticationService', 'configService', '$state'];

    function loginController($http, authenticationService, configService, $state) {
		var vm = this;
		vm.user = {};
        vm.title = "Login";
        vm.showError = false;
		vm.login = login;

		init();

		function init() {
			if (configService.setLogin())
				$state.go("home");

			authenticationService.logout();
		}

		function login() {
            authenticationService.login(vm.user).then(function (result) {
                vm.showError = false;
                $state.go("home");
            }, function (error) {
                vm.showError = true;
            });
		}
	}

})();