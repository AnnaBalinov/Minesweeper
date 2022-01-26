'use strict';

const MINE = '*'
const FLOOR = ' '
const MINE_IMG = '`<img class="wall" src="img/bomb.png">`;'

var gGame = {
    score: 0,
    isOn: false,
    // boardSize: 4
}

var gBoard = []

function initGame() {
    gBoard = buildBoard(4)
    renderBoard(gBoard)
    console.table(gBoard)
}


// Builds the board - V
// Set mines at random locations - V
// Call setMinesNebsCount() - V
// Return the created board - V
function buildBoard(size = 4) {
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
    setMinesInBoard(board)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var minesOfCurrCell = board[i][j].minesAroundCount
            minesOfCurrCell = setMinesNebsCount(board, i, j)
        }
    }
    return board
}

//set mines
function setMinesInBoard(board) {
    board[0][0].isMine = true
    board[2][1].isMine = true
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
            var currCell = FLOOR
            if (board[i][j].isMine) {
                currCell = MINE
            }
            var cellClass = `cell-${i}-${j}`
            var cellId = `i:${i}, j:${j}`
            strHTML += `<td id="${cellId}" onclick="cellClicked(this)" class="${cellClass}">`
            var nebsCount = setMinesNebsCount(board, i, j)
            if (board[i][j].isShown) {
                strHTML += nebsCount
            }
            strHTML += currCell + '</td>'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


//Called when a cell (td) is clicked
function cellClicked(elCell) {
    elCell.isShown = true
    console.log(elCell.isShown)
    renderBoard(gBoard)
    // innerHTML = strHTML
    // var i = d

}

function cellMarked(elCell) {

}

function expandShown(board, elCell, i, j) {

}
