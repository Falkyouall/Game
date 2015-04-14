app.directive('game', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/stage.html',
        replace: true,
        scope: "=",
        controller: 'gameController'

    };
});