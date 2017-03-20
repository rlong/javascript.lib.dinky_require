// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
"use strict";
var library_1 = require("./library");
var angular = require("angular");
var angularModule = angular.module("Sample", []);
angularModule.controller('index', ["$scope", function ($scope) {
        $scope.welcome = library_1.getWelcome();
    }]);
// vvv http://stackoverflow.com/questions/31840800/angularjs-and-requirejs-module-not-available
var ngApp = document.getElementsByClassName("ng-app");
if (ngApp.length > 0) {
    angular.bootstrap(ngApp[0], ["Sample"]);
}
// angular.element(document).ready(function() {
//
// });
// ^^^ http://stackoverflow.com/questions/31840800/angularjs-and-requirejs-module-not-available
//# sourceMappingURL=index.js.map