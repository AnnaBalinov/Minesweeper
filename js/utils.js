'use strict';


function randomCellLocation(board) {
    var cells = []
    for (var i = 0; i < board.length - 1; i++) {
        for (var j = 0; j < board[0].length - 1; j++) {
            if (board[i][j].isMine) break
            cells.push({ i: i, j: j })
        }
    }
    var cellLocation = cells[getRandomIntInclusive(0, cells.length - 1)]
    return cellLocation
}

function renderScore(count) {
    if (!gGame.isOn) return
    var score = document.querySelector('.score')
    score.innerHTML = count
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}