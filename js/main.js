'use strict';

const MINE = '🌸'
const FLOOR = ' '
const COVER = `<img class="cover" src="img/cover.png">`
const FLAG = `<img class="flag" src="img/flag.png">`

var gGame = {
    score: 0,
    isOn: false,
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gExposedCellsCount = 0
var gVictoryScore = 0
var gBoard = []
var gMinesLocation = []
var gTime = 0
var gTimeInterval = 0
var gFirstClick = 0

function initGame(size = 4, mines = 2) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gVictoryScore = (size * size) - mines
    // console.log(gVictoryScore)
    gBoard = buildBoard(size, mines)
    renderBoard(gBoard)
    // console.table(gBoard)
}



function buildBoard(size, mines) {
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
    for (var i = 0; i < mines; i++) {
        var location = randomCellLocation(board)
        board[location.i][location.j].isMine = true
        gMinesLocation.push(location)
        // console.log('mines location', location)
    }
    return board
}


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


function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = COVER
            var cellClass = `cell-${i}-${j}`
            var cellId = `i:${i}, j:${j}`
            strHTML += `<td id="${cellId}" class="${cellClass}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">`
            strHTML += currCell + '</td>'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function cellClicked(elCell, i, j) {

    var elCell = document.querySelector(`.cell-${i}-${j}`)

    gFirstClick++
    if (gFirstClick === 1) {
        gGame.isOn = true
        setTimer()
    }

    if (gBoard[i][j].isMarked || gBoard[i][j].isShown || !gGame.isOn) return

    // // update the model
    gBoard[i][j].isShown = true
    gBoard[i][j].minesAroundCount = setMinesNebsCount(gBoard, i, j)

    // // update the dom
    if (gBoard[i][j].minesAroundCount !== 0) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        gExposedCellsCount++
        renderScore(gExposedCellsCount)

    } else if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
        console.log('game over')        //LOSE: when clicking a mine
        gameOver()
        loos()

    } else {

        elCell.innerText = FLOOR
        ///exp
        gExposedCellsCount++
        renderScore(gExposedCellsCount)
        expandShown(gBoard, i, j)

    }

    if (gExposedCellsCount >= gVictoryScore) {
        console.log('Victory')
        gameOver()
        victory()
    }
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine || currCell.isMarked || currCell.isShown) {
                break
            } else {
                var elNebCell = document.querySelector(`.cell-${i}-${j}`)

                board[i][j].isShown = true
                board[i][j].minesAroundCount = setMinesNebsCount(gBoard, i, j)

                if (currCell.minesAroundCount !== 0) {
                    elNebCell.innerText = currCell.minesAroundCount
                    gExposedCellsCount++
                    renderScore(gExposedCellsCount)
                } else {
                    elNebCell.innerText = FLOOR
                    gExposedCellsCount++
                    renderScore(gExposedCellsCount)
                }
            }
        }
    }
}


function cellMarked(elCell, i, j) {
    window.event.preventDefault()

    if (gBoard[i][j].isShown || !gGame.isOn) return

    if (!gBoard[i][j].isMarked) {

        // update the model
        gBoard[i][j].isMarked = true

        // update the dom
        elCell.innerHTML = FLAG

    } else {
        // update the dom
        gBoard[i][j].isMarked = false
        elCell.innerHTML = COVER
    }

}

function gameOver() {
    gGame.isOn = false
    stopTimer()
    renderScore(0)
    ///all mines should be revealed
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerText = MINE
            }
        }
    }
}

function victory() {
    var elMsg = document.querySelector('.msg')
    elMsg.innerHTML = 'victory! 😎'
}

function loos() {
    var elMsg = document.querySelector('.msg')
    elMsg.innerHTML = 'Loos... 🤯'
    
}


//timer
function setTimer() {
    if (!gGame.isOn) return
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



