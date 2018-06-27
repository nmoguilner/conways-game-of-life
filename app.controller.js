(function () {
    'use strict';

    angular
        .module('gameApp')
        .controller('GameController', GameController);

    function GameController($scope) {

        const that = this;

        that.init = init;
        that.start = start;
        that.stop = stop;
        that.getCells = getCells;
        that.getSteps = getSteps;

        that.startInterestingSample = startInterestingSample;

        that.stepInterval = null;
        that.steps = 0;

        const maxCells = 50;
        let rows = [];

        // cells matrix 
        that.cells = rows;

        function init() {
            drawBoard();
        }

        function start() {
            stop();
            setBasicSample();
            updateBoard();
            that.stepInterval = setInterval(doStep, 500);
        }

        function doStep() {
            if (!stillLivingCells()) {
                alert('No more cells alive. Finished at step: ' + getSteps());
                stop();
                return;
            }

            that.steps++;
            for (let ii = 0; ii < that.cells.length; ii++) {
                for (let jj = 0; jj < that.cells[ii].length; jj++) {
                    let cell = that.cells[ii][jj];
                    let aliveNeighbours = checkAliveNeighbours(cell);

                    if (cell.isAlive) {
                        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
                            cell.isAlive = false;
                        } else if (aliveNeighbours === 2 || aliveNeighbours === 3) {
                            cell.isAlive = true;;
                        }
                    } else {
                        if (aliveNeighbours === 3) {
                            cell.isAlive = true;
                        }
                    }
                    updateBoard();
                }
            }

        }

        function stop() {
            clearInterval(that.stepInterval);
            clearBoard();
        }

        function drawBoard() {
            for (let ii = 0; ii < maxCells; ii++) {
                let cols = [];
                for (let jj = 0; jj < maxCells; jj++) {
                    let cell = {
                        cellId: Math.floor(Math.random() * 10000),
                        rowIndex: ii,
                        colIndex: jj,
                        isAlive: false
                    };
                    cols.push(cell);
                }
                rows.push(cols);
            }
        }

        function setBasicSample() {
            that.cells[0][0].isAlive = true;
            that.cells[0][1].isAlive = true;
            that.cells[1][0].isAlive = true;
            that.cells[1][3].isAlive = true;
            that.cells[2][1].isAlive = true;
            that.cells[2][2].isAlive = true;
        }

        function startInterestingSample() {
            stop();
            setInterestingSample();
            updateBoard();
            that.stepInterval = setInterval(doStep, 50);
        }

        // just for fun
        function setInterestingSample() {
            that.cells[0][0].isAlive = true;
            that.cells[0][1].isAlive = true;
            that.cells[1][0].isAlive = true;
            that.cells[1][3].isAlive = true;
            that.cells[2][1].isAlive = true;
            that.cells[2][2].isAlive = true;
            that.cells[5][4].isAlive = true;
            that.cells[2][4].isAlive = true;
            that.cells[2][3].isAlive = true;
            that.cells[5][3].isAlive = true;
            that.cells[5][5].isAlive = true;
        }


        function clearBoard() {
            setAllDead();
            that.steps = 0;
        }

        function setAllDead() {
            that.cells.map(rows => rows.map(cell => cell.isAlive = false));
        }

        function getCells() {
            return that.cells;
        }

        function getSteps() {
            return that.steps;
        }

        function stillLivingCells() {
            return that.cells.some(row => row.some(cell => cell.isAlive));
        }

        function checkAliveNeighbours(cell) {
            let left, right,
                upperRow, bottomRow,
                upperLeft, upperRight,
                bottomLeft, bottomRight;

            let rowIndex = cell.rowIndex;
            let colIndex = cell.colIndex;
            let aliveNeighboursCount = 0;

            let leftColIndex = colIndex - 1 < 0 ? that.cells[rowIndex].length - 1 : colIndex - 1;
            let rightColIndex = colIndex + 1 > that.cells[rowIndex].length - 1 ? 0 : colIndex + 1;
            let upperRowIndex = rowIndex - 1 < 0 ? that.cells.length - 1 : rowIndex - 1;
            let bottomRowIndex = rowIndex + 1 > that.cells.length - 1 ? 0 : rowIndex + 1;

            left = that.cells[rowIndex][leftColIndex]
            if (!!left && left.isAlive) {
                ++aliveNeighboursCount;
            }

            right = that.cells[rowIndex][rightColIndex]
            if (!!right && right.isAlive) {
                ++aliveNeighboursCount;
            }

            upperRow = that.cells[upperRowIndex];
            if (!!upperRow) {
                if (upperRow[colIndex].isAlive) {
                    ++aliveNeighboursCount;
                }

                upperLeft = that.cells[upperRowIndex][leftColIndex];
                if (!!upperLeft && upperLeft.isAlive) {
                    ++aliveNeighboursCount;
                }

                upperRight = that.cells[upperRowIndex][rightColIndex];
                if (!!upperRight && upperRight.isAlive) {
                    ++aliveNeighboursCount;
                }
            }

            bottomRow = that.cells[bottomRowIndex];
            if (!!bottomRow) {
                if (bottomRow[colIndex].isAlive) {
                    ++aliveNeighboursCount;
                }

                bottomLeft = that.cells[bottomRowIndex][leftColIndex];
                if (!!bottomLeft && bottomLeft.isAlive) {
                    ++aliveNeighboursCount;
                }

                bottomRight = that.cells[bottomRowIndex][rightColIndex];
                if (!!bottomRight && bottomRight.isAlive) {
                    ++aliveNeighboursCount;
                }
            }

            return aliveNeighboursCount;
        }

        function updateBoard() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }

})();
