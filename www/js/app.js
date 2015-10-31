// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'tc.chartjs', 'chart.js', '720kb.datepicker', 'ngScrollbar']);

app.run(function ($ionicPlatform, InventoryService) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

                    InventoryService.initDB();
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('signin', {
                        url: '/sign-in',
                        // abstract: true,
                        templateUrl: 'templates/sign-in.html',
                        controller: 'SignInCtrl'
                    })

                    
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.material', {
                        url: '/material',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/material.html',
                               controller: 'OverviewController'
                            }
                        }
                    })
                        .state('app.addmaterial', {
                        url: '/AddMaterial',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/AddMaterial.html',
                                //controller: 'OverviewController'
                            }
                        }
                    })

                    .state('app.product', {
                        url: '/product',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/product.html',
                                controller: 'ProductController'
                            }
                        }
                    })

                    .state('app.addproduct', {
                        url: '/addproduct',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/AddProduct.html',
                                controller: 'ProductController'
                            }
                        }
                    })

                    .state('app.settings', {
                        url: '/settings',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/settings.html'

                            }
                        }
                    })

                    /*.state('app.export', {
                        url: '/export',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/export.html',
                                controller: 'displayExportData'
                            }
                        }
                    })*/

                    .state('app.kpi', {
                        url: '/dashboard',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/dashboard.html'
                                //controller: 'kpiCtrl'
                            }
                        }
                    })

                    .state('app.single', {
                        url: '/dashboard/:kpiId',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/chart.html',
                                controller: 'drawVisualization'
                            }
                        }
                    })

                    //.state('app.createaccount', {
                    //    url: '/createaccount',
                    //    views: {
                    //        'menuContent': {
                    //            templateUrl: 'templates/createaccount.html'
                    //        }
                    //    }
                    //})
                    .state('app.changecurrency', {
                        url: '/changecurrency',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/changecurrency.html'
                            }
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            //$urlRouterProvider.otherwise('/app/dashboard');
            $urlRouterProvider.otherwise('/sign-in');
        });
