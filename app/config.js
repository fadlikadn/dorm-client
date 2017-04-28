/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider, $httpProvider) {

	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With']; 
	
    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/find-dorm/maps");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('finddorm', {
            abstract: true,
            url: "/find-dorm",
            templateUrl: "views/common/content.html",
			controller: 'contentCtrl'
        })
		.state('finddorm.maps', {
            url: "/maps",
            templateUrl: "views/finddorm.maps.html",
			controller: 'mapsCtrl',
            data: { pageTitle: 'Maps' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
							serie: true,
							name: 'vsGoogleAutocomplete',
                            files: [ 'js/plugins/vs-google-autocomplete/vs-google-autocomplete.js']
                        },
                    ]);
                }
            }
        })
		.state('finddorm.detail', {
            url: "/detail/:dormId",
            templateUrl: "views/finddorm.detail.html",
			controller: 'detailCtrl',
            data: { pageTitle: 'Detail' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        },
                        {
                            serie: true,
                            files: ['js/plugins/daterangepicker/daterangepicker.js', 'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        },
                        {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        },
                    ]);
                }
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
			controller: 'loginCtrl',
            data: { pageTitle: 'Login', specialClass: 'gray-bg' }
        })
		.state('logout', {
            url: "/logout",
            template: "",
			controller: function (AuthenticationService, $state) {
				AuthenticationService.deleteCredentials();
				$state.go("login");
				
			}
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
			controller: 'registerCtrl',
            data: { pageTitle: 'Register', specialClass: 'gray-bg' },
        })
		.state('app', {
            abstract: true,
            url: "/app",
            templateUrl: "views/common/content.html",
			controller: 'contentCtrl'
        })
		.state('app.profile', {
            url: "/profile",
            templateUrl: "views/app.profile.html",
			controller: 'profileCtrl',
            data: { pageTitle: 'Profile' }
        })
		.state('admin', {
            abstract: true,
            url: "/admin",
            templateUrl: "views/common/content.html",
			controller: 'contentCtrl'
        })
		.state('admin.user', {
            url: "/user",
            templateUrl: "views/admin.user.html",
			controller: 'userCtrl',
            data: { pageTitle: 'User' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })
		.state('admin.dorm_provider', {
            url: "/dorm_provider",
            templateUrl: "views/admin.dorm_provider.html",
			controller: 'dormProviderCtrl',
            data: { pageTitle: 'Dorm Provider' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })
		.state('admin.dormitory', {
            url: "/dormitory",
            templateUrl: "views/admin.dormitory.html",
			controller: 'dormitoryCtrl',
            data: { pageTitle: 'Dormitory' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })
		.state('admin.booking', {
            url: "/booking",
            templateUrl: "views/admin.booking.html",
			controller: 'adminbookingCtrl',
            data: { pageTitle: 'View Booking' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })
		.state('dp', {
            abstract: true,
            url: "/dp",
            templateUrl: "views/common/content.html",
			controller: 'contentCtrl'
        })
		.state('dp.dormitory', {
            url: "/dormitory",
            templateUrl: "views/dp.dormitory.html",
			controller: 'dpdormitoryCtrl',
            data: { pageTitle: 'Dormitory' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })
		.state('dp.viewbooking', {
            url: "/viewbooking",
            templateUrl: "views/dp.viewbooking.html",
			controller: 'viewbookingCtrl',
            data: { pageTitle: 'View Booking' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })
		.state('mybooking', {
            abstract: true,
            url: "/mybooking",
            templateUrl: "views/common/content.html",
			controller: 'contentCtrl'
        })
		.state('mybooking.booking', {
            url: "/booking",
            templateUrl: "views/mybooking.booking.html",
			controller: 'mybookingCtrl',
            data: { pageTitle: 'My Booking' },
			resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js','css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
						{
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }
                    ]);
                }
            }
        })

}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
