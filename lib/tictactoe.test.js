const TicTacToe = require('./tictactoe')

test('TicTacToe manual game', () => {
    const game = new TicTacToe()
    expect(game).not.toBe(null)
})