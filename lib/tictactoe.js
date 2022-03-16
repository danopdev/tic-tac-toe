class TicTacToe {
    static get X() { return 'x' }
    static get O() { return 'o' }
    static get None() { return '-' }

    constructor( board ) {
        this._board = [
            '', '', '',
            '', '', '',
            '', '', ''
        ]

        this.newGame()
        if (board) this.setBoard(board)
    }


    _evaluateBoard() {
        for (var i = 0; i < 3; i++) {
            if (TicTacToe.None !== this._board[3*i] && this._board[3*i] == this._board[3*i+1] && this._board[3*i] == this._board[3*i+2]) {
                return this._board[3*i]
            }

            if (TicTacToe.None !== this._board[i] && this._board[i] == this._board[i+3] && this._board[i] == this._board[i+6]) {
                return this._board[i]
            }
        }

        if (TicTacToe.None !== this._board[0] && this._board[0] == this._board[4] && this._board[0] == this._board[8]) {
            return this._board[0]
        }

        if (TicTacToe.None !== this._board[2] && this._board[2] == this._board[4] && this._board[2] == this._board[6]) {
            return this._board[2]
        }

        return TicTacToe.None
    }


    _evaluateBoardForCurrentPlayer() {
        var status = this._evaluateBoard()
        if (TicTacToe.None == status) return 0
        if (this._currentPlayer == status) return 10
        return -10
    }


    _minimax( depth, isMax ) {
        var score = this._evaluateBoardForCurrentPlayer()

        if (0 != score) {
            score += (isMax ? depth : -depth)
        } else {
            var found = false

            if (isMax) {
                score = -1000
                for (var i in this._board) {
                    if (TicTacToe.None === this._board[i]) {
                        this._board[i] = this._currentPlayer
                        score = Math.max( score, this._minimax(depth + 1, false))
                        this._board[i] = TicTacToe.None
                        found = true
                    }
                }
            } else {
                score = 1000
                const oponent = TicTacToe.X == this._currentPlayer ? TicTacToe.O : TicTacToe.X
                for (var i in this._board) {
                    if (TicTacToe.None == this._board[i]) {
                        this._board[i] = oponent
                        score = Math.min( score, this._minimax(depth + 1, true))
                        this._board[i] = TicTacToe.None
                        found = true
                    }
                }
            }
 
            if (!found) score = 0
        }

        //dumpBoard( board, `depth: ${depth}, score: ${score}` )

        return score
    }


    newGame() {
        for (var i in this._board) {
            this._board[i] = TicTacToe.None
        }
        this._currentPlayer = TicTacToe.X
        this._gameStatus = TicTacToe.None
    }


    getBoard() { //read only copy
        return [ ...this._board ]
    }

    setBoard(board) { // for debug
        this.newGame()

        for (var i = 0; i < Math.min(board.length, this._board.length); i++) {
            this._board[i] = (TicTacToe.X == board[i].toLowerCase()) ?
                TicTacToe.X :
                ( (TicTacToe.O == board[i].toLowerCase()) ? TicTacToe.O : TicTacToe.None )
        }

        const countX = this._board.map( value => TicTacToe.X == value ? 1 : 0 ).reduce( (prev, value) => prev + value, 0 )
        const countO = this._board.map( value => TicTacToe.O == value ? 1 : 0 ).reduce( (prev, value) => prev + value, 0 )
        this._currentPlayer = countX > countO ? TicTacToe.O : TicTacToe.X
        this._gameStatus = this._evaluateBoard()
    }


    gameStatus() {
        return this._gameStatus
    }


    currentPlayer() {
        return this._currentPlayer
    }


    canPlay(i, j) {
        if (j != null) i = 3 * i + j
        return TicTacToe.None === this._gameStatus && TicTacToe.None === this._board[i]
    }


    play(i, j) {
        if (j != null) i = 3 * i + j

        if (this.canPlay(i)) {
            this._board[i] = this._currentPlayer
            this._gameStatus = this._evaluateBoard()
            const player = this._currentPlayer
            this._currentPlayer = TicTacToe.X == this._currentPlayer ? TicTacToe.O : TicTacToe.X
            return { player, position: i,  gameStatus: this._gameStatus }
        }

        return null
    }


    playAuto() {
        if (TicTacToe.None !== this._gameStatus) return null

        var bestVal = -1000
        var bestMove = -1

        for(var i in this._board) {
            if (TicTacToe.None == this._board[i]) {
                this._board[i] = this._currentPlayer
                const moveVal = this._minimax(0, false)
                this._board[i] = TicTacToe.None

                if (moveVal > bestVal) {
                    bestMove = i
                    bestVal = moveVal
                }
            }
        }

        if (bestMove >= 0) return this.play(bestMove)
        return null
    }


    dump( board, msg ) {
        if (msg) console.log(msg)
        console.log(`Status: ${this._gameStatus}, player: ${this._currentPlayer}`)
        for( var i = 0; i < 3; i++) console.log(this._board[3*i] + this._board[3*i+1] + this._board[3*i+2])
        console.log('')
    }
}


module.exports = TicTacToe


/*
const arraysEqual = (a1, a2) => a1.length === a2.length && a1.every((o, idx) => o === a2[idx]);

const autoplay_test = function( inputBoard, expectedBoard ) {
    const ticTacToe = new TicTacToe(inputBoard)
    if (!arraysEqual(ticTacToe.getBoard(), inputBoard)) return false

    try {
        ticTacToe.playAuto()
    } catch(e) {
    }

    const resultBoard = ticTacToe.getBoard()

    console.log(`Input: ${inputBoard[0]}${inputBoard[1]}${inputBoard[2]}   Expect: ${expectedBoard[0]}${expectedBoard[1]}${expectedBoard[2]}   Result: ${resultBoard[0]}${resultBoard[1]}${resultBoard[2]}`)
    console.log(`       ${inputBoard[3]}${inputBoard[4]}${inputBoard[5]}           ${expectedBoard[3]}${expectedBoard[4]}${expectedBoard[5]}           ${resultBoard[3]}${resultBoard[4]}${resultBoard[5]}`)
    console.log(`       ${inputBoard[6]}${inputBoard[7]}${inputBoard[8]}           ${expectedBoard[6]}${expectedBoard[7]}${expectedBoard[8]}           ${resultBoard[6]}${resultBoard[7]}${resultBoard[8]}`)

    return arraysEqual(resultBoard, expectedBoard)
}

const autoplay_tests_configurations = [
    [
        [
            'o', 'o', '-',
            'x', '-', 'x',
            '-', '-', '-'
        ],
        [
            'o', 'o', '-',
            'x', 'x', 'x',
            '-', '-', '-'
        ]
    ],
    [
        [
            'o', 'o', 'x',
            '-', '-', '-',
            'x', '-', '-'
        ],
        [
            'o', 'o', 'x',
            '-', 'x', '-',
            'x', '-', '-'
        ]
    ],
]



const autoplay_tests = function() {
    var globalStatus = true
    for(const test_configuration of autoplay_tests_configurations) {
        if (!autoplay_test( test_configuration[0], test_configuration[1] )) {
            globalStatus = false
            console.log("Failed !")
        } else {
            console.log("Success")
        }
    }
}

autoplay_tests()
*/