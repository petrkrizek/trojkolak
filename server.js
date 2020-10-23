const io = require('./io.js')
const Game = require('./game.js')

/*
    Error codes
    nogame      - this game doesn't exist
    oneteam     - you need more than one team to play
    oneplayer   - all players need to be in teams
*/

let games = []


findGame = (gameId) => {
    return games.find(g => g.id === gameId)
}

io.on('connection', socket => {
    socket.on('createGame', username => {
        //Create new Game object and add the player to it
        let game = new Game()
        socket.join(game.id)
        game.addPlayer(socket.id, username)
        
        game.leader = socket.id
        socket.emit('leader')

        //Save relation for future reference
        socket.game = game.id

        //Save game to list of games
        games.push(game)
    })

    socket.on('joinGame', data => {
        let {gameId, username} = data

        let game = games.find(g => g.id === gameId) || false
        if (game) {
            socket.join(game.id)
            game.addPlayer(socket.id, username)
            socket.game = game.id

        } else {
            socket.emit('error', 'nogame')
        }
    })

    socket.on('joinTeam', teamId => {
        let game = findGame(socket.game)
        game.joinTeam(teamId, socket.id)
    })

    socket.on('leaveTeam', () => {
        let game = findGame(socket.game)
        game.makeTeam(socket.id)
    })

    socket.on('startGame', () => {
        let game = findGame(socket.game)
        game.start()
    })

    socket.on('addWord', (word) => {
        let game = findGame(socket.game)
        game.addWord(word, socket.id)
    })
})
