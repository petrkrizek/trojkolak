const io = require('./io.js')
const Game = require('./game.js')
const {v4:uuidv4} = require('uuid')

/*
    Error codes
    nogame      - this game doesn't exist
    oneteam     - you need more than one team to play
    oneplayer   - all players need to be in teams
*/

let games = []
let users = []

io.on('connection', socket => {
    console.log(socket.id, ' connected')
    socket.on('createGame', username => {
        //Create new Game object and add the player to it
        let game = new Game()
        let userId = uuidv4()
        socket.join(game.id)
        game.addPlayer(socket.id, userId, username)
        game.leader = userId
        socket.emit('leader')

        //Save relation for future reference
        socket.game = game

        //Store data in user array for reconnection
        users.push({
            id: userId,
            socket: socket,
            game: game
        })
        io.to(socket.id).emit('uid', userId)

        //Save game to list of games
        games.push(game)

        console.log('New game created by ', username)
    })

    socket.on('joinGame', data => {
        let {gameId, username} = data
        let game
        let userId = uuidv4()
        if (game = games.find(g => g.id === gameId)) {
            socket.join(game.id)
            game.addPlayer(socket.id, userId, username)

            socket.game = game

            //Store data for reconnection
            users.push({
                id: userId,
                socket: socket,
                game: game
            })
            io.to(socket.id).emit('uid', userId)
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

    socket.on('addWord', word => {
        socket.game.addWord(word, socket.id)
        console.log(word)
    })

    socket.on('startRound', () => {
        socket.game.subRound()
    })

    socket.on('guessedWord', () => {
        socket.game.guessedWord()
    })

    socket.on('canvas-draw', data => {
        console.log(data)
        io.emit('canvas-draw', data)
    })

    socket.on('canvas-isdrawing', data => {
        io.emit('canvas-isdrawing', data)
    })

    socket.on('leave', () => {
        socket.game = false
        users = users.filter(u => u.socket === socket)
    })

    socket.on('reconnection', id => {
        console.log(id)

        let user = users.find(u => u.id === id)
        if (user) {
            user.socket = socket
            socket.game = user.game
            user.socket.join(user.game.id)
            user.game.handleReconnect(user.id, socket.id)
        } else {
            io.to(socket.id).emit('nogame')
        }
    })

    socket.on('playagain', () => {
        socket.game.playAgain()
    })

})
