'use strict';

const START = '😊'
const LOSER = '🤯'
const WINNER = '😎'

const MINE = '🌸'
const LIFE = '❤️'
const DEAD = '☠️'

const FLOOR = ' '
const COVER = '<img class="cover" src="img/cover.png">'
const FLAG = '<img class="flag" src="img/flag.png">'

const PLAY_MUSIC = '▶️'
const PAUSE_MUSIC = '⏸️'

const CLICK_SOUND = '<audio src="music/click.mp3"></audio>'


var gGame = {
    score: 0,
    isOn: false,
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 3
}

var gTime = 0
var gFirstClick = 0
var gLossesCount = 0
var gTimeInterval = 0
var gVictoryScore = 0
var gExposedCellsCount = 0

var gBoard = []
var gMinesLocation = []


function initGame() {
    gVictoryScore = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES

    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    console.log(gLevel)
    console.table(gBoard)
    console.log('gVictoryScore', gVictoryScore)

}


function resetGame(size, mines, lives) {

    var elMsg = document.querySelector('.msg')
    elMsg.innerHTML = 'Minesweeper ' + START

    gLevel.SIZE = size
    gLevel.MINES = mines
    gLevel.LIVES = lives

    gGame.score = 0
    gGame.isOn = false

    gTime = 0
    gFirstClick = 0
    gLossesCount = 0
    gExposedCellsCount = 0

    gBoard = []
    gMinesLocation = []

    updateLives(gLevel.LIVES)
    renderScore(0)
    stopTimer()
    resetTime()
    initGame()
}


function buildBoard(size) {
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
    return board
}


function setMines(board, mines) {
    for (var i = 0; i < mines; i++) {
        var location = randomCellLocation(board)
        board[location.i][location.j].isMine = true
        gMinesLocation.push(location)
        console.log('mines location', location)
    }
    return
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

function updateLives(num) {
    var lives = document.querySelector('.lives')
    if (num !== 0) {
        lives.innerHTML = LIFE.repeat(num)
    } else {
        lives.innerHTML = DEAD
    }
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
        setMines(gBoard, gLevel.MINES)
    }

    if (gBoard[i][j].isMarked || gBoard[i][j].isShown || !gGame.isOn) return

    //// update the model
    gBoard[i][j].isShown = true
    gBoard[i][j].minesAroundCount = setMinesNebsCount(gBoard, i, j)

    //// update the dom
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
        gLossesCount++
        var diff = gLevel.LIVES - gLossesCount ////Lives
        updateLives(diff)

        console.log('gLossesCount', gLossesCount)
        console.log('gLevel.LIVES', gLevel.LIVES)
        console.log('diff', diff)

        if (diff !== 0) {
            return
        } else {
            console.log('game over')
            gameOver()
            loss()
            return
        }
    }

    if (gBoard[i][j].minesAroundCount !== 0) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        gExposedCellsCount++
        renderScore(gExposedCellsCount)
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
            cellClicked(currCell, i, j)
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
    elMsg.innerHTML = 'victory! ' + WINNER
}

function loss() {
    var elMsg = document.querySelector('.msg')
    elMsg.innerHTML = 'Loss... ' + LOSER

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

function resetTime() {
    var elTime = document.querySelector('.timer')
    elTime.innerHTML = 0
}

//music
var gAudioPlay = true
function musicPlayPause(music) {
    var audio = document.querySelector('iframe')
    if (gAudioPlay) {
        audio.src = "none"
        music.innerHTML = PLAY_MUSIC
        gAudioPlay = false
    } else {
        audio.src = "music/background music.mp3"
        music.innerHTML = PAUSE_MUSIC
        gAudioPlay = true
    }
}