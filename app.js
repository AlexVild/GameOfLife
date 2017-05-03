'use strict';

angular.module('GOL',[])
.controller('MainController', function($scope, $interval){
    $scope.width = 8;
    $scope.height = 8;
    $scope.table = [];
    $scope.animate = false;
    $scope.animationTime = 1000;

    // Function generates a new blank table
    $scope.generateTable = function(){
        $scope.animate = false;
        $scope.table = [];
        var uniqueId = 0;
        for (var i = 0; i < $scope.height; i++) {
            $scope.table[i] = []
            for (var j = 0; j < $scope.width; j++) {
                $scope.table[i].push({
                    display: 'X',
                    alive: false,
                    id: uniqueId,
                    neighbors: 0
                });
                uniqueId++;
            }
        }
    }
    // Run function on init
    $scope.generateTable();

    // This changes whether or not a particular cell is dead or alive
    $scope.changeProp = function(x, y, set){
        if (set === true){
            $scope.table[x][y].alive = true;
        } else if (set === false){
            $scope.table[x][y].alive = false;
        } else{ // toggle
            $scope.animate = false;
            $scope.table[x][y].alive = !$scope.table[x][y].alive;
        }
        $scope.table[x][y].alive ? $scope.table[x][y].display = 'O' : $scope.table[x][y].display = 'X';
    }

    // play game of life
    $scope.play = function(){
        // Get neighbors
        for (var i = 0; i < $scope.height; i++) {
            for (var j = 0; j < $scope.width; j++) {
                $scope.table[i][j].neighbors = 0;
                $scope.checkNeighbors(i, j);
            }
        }
        // Calculate who's living or dead
        for (var i = 0; i < $scope.height; i++) {
            for (var j = 0; j < $scope.width; j++) {
                $scope.rules(i, j, $scope.table[i][j].neighbors);
            }
        }

    };

    // Checks number of neighbors
    $scope.checkNeighbors = function(i, j){
        var startI = (i - 1 < 0) ? i : i - 1;
        var startJ = (j - 1 < 0) ? j : j - 1;
        var endI   = (i + 1 >= $scope.height) ? i : i + 1;
        var endJ   = (j + 1 >= $scope.width)  ? j : j + 1;
        for(var x = startI; x <= endI; x++){
            for(var y = startJ; y <= endJ; y++){
                if($scope.table[x][y].alive && !(x == i && y == j)){
                    $scope.table[i][j].neighbors++;
                }
            }
        }
    }

    // Check to change the status of a node
    $scope.rules = function(i, j, neighbors){
        if (neighbors > 3){
            $scope.changeProp(i, j, false);
        } else if (neighbors < 2){
            $scope.changeProp(i, j, false);
        }else if (neighbors === 3 && !$scope.table[i][j].alive){
            $scope.changeProp(i, j, true);
        }
    }

    // Animation stuff (watch for update to animation time, interval for animation)
    var animateFunc = function(){
        if($scope.animate){
            $scope.play();
        }
    };

    var animateUpdate = $interval(animateFunc, $scope.animationTime);

    $scope.$watch('animationTime', function(){
        $interval.cancel(animateUpdate);
        if($scope.animationTime >= 500){
            animateUpdate = $interval(animateFunc, $scope.animationTime);
        }
    });

    // This function is used to load in a sample problem
    $scope.sample = function(type){
        switch(type){
            case 'given':
                $scope.width = 8;
                $scope.height = 6;
                $scope.generateTable();
                $scope.changeProp(0, 6, true);
                $scope.changeProp(1, 6, true);
                $scope.changeProp(2, 6, true);
                $scope.changeProp(1, 0, true);
                $scope.changeProp(1, 1, true);
                $scope.changeProp(1, 2, true);
                $scope.changeProp(4, 3, true);
                $scope.changeProp(4, 4, true);
                $scope.changeProp(5, 3, true);
                $scope.changeProp(5, 4, true);
                break;
            case 'toad':
                $scope.width = 6;
                $scope.height = 6;
                $scope.generateTable();
                $scope.changeProp(2, 1, true);
                $scope.changeProp(3, 1, true);
                $scope.changeProp(4, 2, true);
                $scope.changeProp(1, 3, true);
                $scope.changeProp(2, 4, true);
                $scope.changeProp(3, 4, true);
                break;
            case 'ship':
                $scope.width = 20;
                $scope.height = 20;
                $scope.generateTable();
                $scope.changeProp(19, 7, true);
                $scope.changeProp(19, 9, true);
                $scope.changeProp(18, 10, true);
                $scope.changeProp(17, 10, true);
                $scope.changeProp(16, 10, true);
                $scope.changeProp(15, 10, true);
                $scope.changeProp(16, 7, true);
                $scope.changeProp(15, 8, true);
                $scope.changeProp(15, 9, true);
                break;
            case 'safe':
                $scope.width = 12;
                $scope.height = 12;
                $scope.generateTable();
                // Square
                $scope.changeProp(1, 1, true);
                $scope.changeProp(2, 1, true);
                $scope.changeProp(1, 2, true);
                $scope.changeProp(2, 2, true);
                // Beehive
                $scope.changeProp(3, 7, true);
                $scope.changeProp(4, 6, true);
                $scope.changeProp(4, 8, true);
                $scope.changeProp(5, 6, true);
                $scope.changeProp(5, 8, true);
                $scope.changeProp(6, 7, true);
                // boat
                $scope.changeProp(10, 11, true);
                $scope.changeProp(10, 10, true);
                $scope.changeProp(9, 11, true);
                $scope.changeProp(9, 9, true);
                $scope.changeProp(8, 9, true);
                $scope.changeProp(8, 10, true);
                break;
        }
    }
});
