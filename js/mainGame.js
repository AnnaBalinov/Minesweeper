'use strict';

const MINE = '🌸'
const FLOOR = ' '
const MINE_IMG = `<img class="bomb" src="img/bomb.png">`
const COVER = `<img class="cover" src="img/cover.png">`

var gGame = {
    score: 0,
    isOn: false,
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBoard = []
var gTime = 0
var gTimeInterval;

function initGame(level, mines) {
    gBoard = buildBoard(level, mines)
    renderBoard(gBoard)
    console.table(gBoard)
}

// Builds the board - V
// Set mines at random locations - V
// Call setMinesNebsCount() - V
// Return the created board - V
function buildBoard(size = 4, level = 2) {
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    //set mines
    for (var i = 0; i < level; i++) {
        var location = randomCellLocation(board)
        board[location.i][location.j].isMine = true
    }

    return board
}


//set random mines on board 
function randomCellLocation(board) {
    var cells = []
    for (var i = 0; i < board.length - 1; i++) {
        for (var j = 0; j < board[0].length - 1; j++) {
            cells.push({ i: i, j: j })
        }
    }
    var cellLocation = cells[getRandomIntInclusive(0, cells.length - 1)]
    return cellLocation
}


//Count mines around each cell - V
//and set the cell's minesAroundCount - X
function setMinesNebsCount(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}


//Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = COVER
            // if (board[i][j].isMine) {
            //     currCell = MINE
            // }
            var cellClass = `cell-${i}-${j}`
            var cellId = `i:${i}, j:${j}`
            strHTML += `<td id="${cellId}" onclick="cellClicked(this, ${i}, ${j})" class="${cellClass}">`
            strHTML += currCell + '</td>'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML


}


//Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {

    var elCell = document.querySelector(`.cell-${i}-${j}`)

    // // update the model
    gBoard[i][j].isShown = true
    gBoard[i][j].minesAroundCount = setMinesNebsCount(gBoard, i, j)

    // // update the dom
    if (gBoard[i][j].minesAroundCount !== 0) {
        elCell.innerText = gBoard[i][j].minesAroundCount
    } else {
        elCell.innerText = FLOOR
    }
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
    }


    setTimer()
}


function cellMarked(elCell) {

}

function expandShown(board, elCell, i, j) {

}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//timer
function setTimer() {
    if (gGame.isOn) return
    gGame.isOn = true
    gTimeInterval = setInterval(renderTime, 10)
    gTime = Date.now()
}

function renderTime() {
    var now = Date.now()
    var time = ((now - gTime) / 1000).toFixed(2)
    var elTime = document.querySelector('.timer')
    elTime.innerHTML = time
}

function stopTimer() {
    clearInterval(gTimeInterval)
    gTimeInterval = 0
}
