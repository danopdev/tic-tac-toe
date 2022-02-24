const GAME_PLAY_X = 'X';
const GAME_PLAY_O = 'O';
const GAME_PAUSE = '';
const GAME_DRAW = '-';
const GAME_X_WINS = 'x';
const GAME_O_WINS = 'y';

const stateToInfo = {
    [GAME_PLAY_X]: { msg: 'Next symbol: X', classes: ['state-play-x'], },
    [GAME_PLAY_O]: { msg: 'Next symbol: O', classes: ['state-play-o'] },
    [GAME_PAUSE]:  { msg: 'none', classes: ['state-pause'] },
    [GAME_DRAW]:  { msg: 'Draw', classes: ['state-draw'] },
    [GAME_X_WINS]:  { msg: 'X Wins !', classes: ['state-x-wins'] },
    [GAME_O_WINS]:  { msg: 'O Wins !', classes: ['state-o-wins'] },
}

const stateClasses = ['state-play-x', 'state-play-o', 'state-pause', 'state-draw', 'state-x-wins', 'state-o-wins']

var gameState = GAME_PAUSE;
var gameRound = 0;


const sleep = function(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


const setState = function(state) {
    gameState = state;
    const element = document.getElementById("message");
    const info = stateToInfo[state];
    element.innerText = info.msg;
    element.classList.remove(...stateClasses)
    element.classList.add(...info.classes)
}


const newGame = async function( firstCall = false ) {
    setState(GAME_PAUSE);

    const cells = document.getElementsByClassName("board-item-content");

    for( const cell of cells) {
        cell.classList.add( 'board-item-stop-animation' );
    };

    if (!firstCall) await sleep(1);

    for( const cell of cells) {
        cell.classList.remove( 'board-item-stop-animation', 'board-item-win' );
        cell.classList.add( 'board-item-reset' );
    };

    if (!firstCall) await sleep(1000);
    for( const cell of cells) {
        cell.classList.remove( 'board-item-active', 'board-item-x', 'board-item-o', 'board-item-reset' );
    };

    gameRound = 0;
    setState(GAME_PLAY_X);
}


const getCellId = (line, column) => 'cell' + (line * 3 + column);


const hasClass = function(positions, className) {
    var cells = [];

    for (const position of positions) {
        const cellId = getCellId(position[1], position[0]);
        const element = document.getElementById(cellId).firstChild;
        if (!element.classList.contains(className)) return null;
        cells.push(cellId)
    }

    return cells;
}


const checkWin = function( className ) {
    var cells = null;
    //check linex and columns
    for (i = 0; i < 3; i++ ) {
        cells = hasClass([[0,i], [1,i], [2,i]], className);
        if (null !== cells) return cells;
        cells = hasClass([[i,0], [i,1], [i,2]], className);
        if (null !== cells) return cells;
    }

    //check diagonals
    cells = hasClass([[0,0], [1,1], [2,2]], className);
    if (null !== cells) return cells;
    return hasClass([[0,2], [1,1], [2,0]], className);
}


const handleClick = async function(event) {
    if (GAME_PLAY_X !== gameState && GAME_PLAY_O !== gameState) return;

    const src = event.srcElement;
    if (!src.classList.contains('board-item')) return;
    const child = src.firstChild;

    const classList = child.classList;
    if (classList.contains('board-item-active')) return;

    const className = (GAME_PLAY_X === gameState) ? 'board-item-x' : 'board-item-o';
    classList.add( 'board-item-active', className );

    const winCells = checkWin(className)
    if (null == winCells) {
        gameRound += 1;
        if (9 == gameRound) {
            setState(GAME_DRAW);
            return;
        }

        setState((GAME_PLAY_X === gameState) ? GAME_PLAY_O : GAME_PLAY_X);
        return;
    }

    setState((GAME_PLAY_X === gameState) ? GAME_X_WINS : GAME_O_WINS);
    for (const cellId of winCells) {
        document.getElementById(cellId).firstChild.classList.add("board-item-win");
    }
}


newGame(true);
