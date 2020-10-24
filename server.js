const io = require('./io.js')
const Game = require('./game.js')

/*
    Error codes
    nogame      - this game doesn't exist
    oneteam     - you need more than one team to play
    oneplayer   - all players need to be in teams
*/

let games = []

io.on('connection', socket => {
    console.log(socket.id, ' connected!')
    socket.on('createGame', username => {
        //Create new Game object and add the player to it
        let game = new Game()
        socket.join(game.id)
        game.addPlayer(socket.id, username)
        
        game.leader = socket.id
        socket.emit('leader')

        //Save relation for future reference
        socket.game = game

        //Save game to list of games
        games.push(game)
    })

    socket.on('joinGame', data => {
        let {gameId, username} = data

        let game = games.find(g => g.id === gameId) || false
        if (game) {
            socket.join(game.id)
            game.addPlayer(socket.id, username)
            socket.game = game
        } else {
            socket.emit('error', 'nogame')
        }
    })

    socket.on('joinTeam', teamId => {
        socket.game.joinTeam(teamId, socket.id)
    })

    socket.on('leaveTeam', () => {
        socket.game.makeTeam(socket.id)
    })

    socket.on('startGame', () => {
        socket.game.start()
    })

    socket.on('addWord', (word) => {
        socket.game.addWord(word, socket.id)
    })

    socket.on('startRound', () => {
        socket.game.subRound()
    })

    socket.on('guessedWord', () => {
        socket.game.guessedWord()
    })
})
