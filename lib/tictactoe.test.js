const TicTacToe = require('./tictactoe')

test('TicTacToe manual game', () => {
    const game = new TicTacToe()
    expect(game).not.toBe(null)
    expect(game.currentPlayer()).toBe(TicTacToe.X)
    expect(game.gameStatus()).toBe(TicTacToe.None)
    expect(game.getBoard()).toStrictEqual(['-', '-', '-', '-', '-', '-', '-', '-', '-'])
    expect(game.canPlay(1,1)).toBe(true)
    expect(game.canPlay(4)).toBe(true)
    expect(game.play(4)).not.toBe(null)
    expect(game.getBoard()).toStrictEqual(['-', '-', '-', '-', 'x', '-', '-', '-', '-'])
    expect(game.play(2,2)).not.toBe(null)
    expect(game.getBoard()).toStrictEqual(['-', '-', '-', '-', 'x', '-', '-', '-', 'o'])
    expect(game.play(1)).not.toBe(null)
    expect(game.play(2)).toStrictEqual({ player: 'o', position: 2,  gameStatus: '-' })
    expect(game.play(7)).toStrictEqual({ player: 'x', position: 7,  gameStatus: 'x' })
    expect(game.play(0)).toBe(null)
    expect(game.canPlay(0)).toBe(false)
    game.dump('test')
    game.dump()
    game.newGame()
    expect(game.currentPlayer()).toBe(TicTacToe.X)
    expect(game.gameStatus()).toBe(TicTacToe.None)
    expect(game.getBoard()).toStrictEqual(['-', '-', '-', '-', '-', '-', '-', '-', '-'])
})

test('TicTacToe boards', () => {
    const boardsTestsConfigurations = [
        {
            input: [ 'o', 'o', '-', 'x', '-', 'x', '-', '-', '-'],
            output: [ 'o', 'o', '-', 'x', '-', 'x', '-', '-', '-'],
            gameStatus: '-',
            currentPlayer: 'x'
        },
        {
            input: [ 'o', '-', '-', 'x', '-', 'x', '-', '-', '-'],
            output: [ 'o', '-', '-', 'x', '-', 'x', '-', '-', '-'],
            gameStatus: '-',
            currentPlayer: 'o'
        },
        {
            input: [ 'o', 'o', 'o', 'x', '-', 'x', '-', '-', '-'],
            output: [ '-', '-', '-', '-', '-', '-', '-', '-', '-'],
            gameStatus: '-',
            currentPlayer: 'x'
        },
        {
            input: [ 'o', '-', 'x', 'x', '-', 'x', '-', '-', '-'],
            output: [ '-', '-', '-', '-', '-', '-', '-', '-', '-'],
            gameStatus: '-',
            currentPlayer: 'x'
        },
    ]


    for (board of boardsTestsConfigurations) {
        const game = new TicTacToe(board.input)
        expect( game.getBoard() ).toStrictEqual( board.output )
        expect( game.currentPlayer() ).toBe( board.currentPlayer )
        expect( game.gameStatus() ).toBe( board.gameStatus )
    }
})

test('TicTacToe auto play', () => {
    const autoplayTestsConfigurations = [
        {
            input: [ 'o', 'o', '-', 'x', '-', 'x', '-', '-', '-'],
            output: [ 'o', 'o', '-', 'x', 'x', 'x', '-', '-', '-'],
            gameStatus: 'x',
            currentPlayer: 'o'
        },
        {
            input: [ 'o', 'o', 'x', '-', '-', '-', 'x', '-', '-' ],
            output: [ 'o', 'o', 'x', '-', 'x', '-', 'x', '-', '-' ],
            gameStatus: 'x',
            currentPlayer: 'o'
        },
        {
            input: [ 'x', '-', 'x', 'o', '-', '-', '-', '-', '-' ],
            output: [ 'x', 'o', 'x', 'o', '-', '-', '-', '-', '-' ],
            gameStatus: '-',
            currentPlayer: 'x'
        },
    ]

    for (board of autoplayTestsConfigurations) {
        const game = new TicTacToe(board.input)
        expect( game.getBoard() ).toStrictEqual( board.input )
        expect( game.playAuto() ).not.toBe(null)
        expect( game.getBoard() ).toStrictEqual( board.output )
        expect( game.currentPlayer() ).toBe( board.currentPlayer )
        expect( game.gameStatus() ).toBe( board.gameStatus )

        if (game.gameStatus() != '-') {
            expect( game.playAuto() ).toBe(null)
        }
    }


    {
        const board = [ 'o', 'x', 'o', 'x', 'o', 'x', 'x', 'o', 'x' ]
        const game = new TicTacToe( board )
        expect( game.getBoard() ).toStrictEqual( board )
        expect( game.playAuto() ).toBe(null)
    }
})