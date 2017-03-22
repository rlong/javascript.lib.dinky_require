// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//


/// <reference path="library.ts" />


var angularModule= angular.module("Sample", []);


angularModule.controller('index',
    ["$scope", function ( $scope) {

        $scope.welcome = getWelcome();

    }]);

// vvv http://stackoverflow.com/questions/31840800/angularjs-and-requirejs-module-not-available

let ngApp = document.getElementsByClassName( "ng-app" );
if( ngApp.length > 0 ) {
    angular.bootstrap(ngApp[0], ["Sample"]);
}

// angular.element(document).ready(function() {
//
// });

// ^^^ http://stackoverflow.com/questions/31840800/angularjs-and-requirejs-module-not-available
