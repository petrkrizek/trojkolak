const io = require('./io.js')
const Game = require('./game.js')
const { INTERNAL_COMPUTE_OFFSET_SCRIPT } = require('selenium-webdriver/lib/input')

/*
    Error codes
    nogame      - this game doesn't exist
    oneteam     - you need more than one team to play
    oneplayer   - all players need to be in teams
*/

let games = []

io.on('connection', socket => {
    console.log(socket.id, ' connected')
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

        console.log('New game created by ', username)
    })

    socket.on('joinGame', data => {
        let {gameId, username} = data
        let game
        if (game = games.find(g => g.id === gameId)) {
            socket.join(game.id)
            game.addPlayer(socket.id, username)
            socket.game = game

        } else {
            //socket.emit('error', 'nogame')
            console.log('nonexistent game')
        }
    })

    socket.on('joinTeam', teamId => {
        socket.game.joinTeam(teamId, socket.id)
        console.log('-----------')
        socket.game.state.teams.forEach(team => {
            console.log(team.players)
        })
    })

    socket.on('leaveTeam', () => {
        socket.game.makeTeam(socket.id)
    })

    socket.on('startGame', () => {
        socket.game.start()
    })

    socket.on('addWord', (word) => {
        socket.game.addWord(word, socket.id)
        console.log(word)
    })

    socket.on('startRound', () => {
        socket.game.subRound()
    })

    socket.on('guessedWord', () => {
        socket.game.guessedWord()
    })
})
