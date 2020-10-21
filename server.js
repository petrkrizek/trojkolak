const express = require('express')
const app = express()
const path = require('path')
const {v4:uuidv4} = require('uuid')
const PORT = process.env.PORT || 5000


app.use('/', express.static(path.join(__dirname, 'client/build/')))
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require('socket.io').listen(server);

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

//Game State
const gameState = {
    players: [],
    rooms: [],
}

startRound = (socket) => {
    let room = playerRoom(socket)
    let teams = room.teams

    //Set current player
    room.currentPlayer = teams[0].players[0]
    let currentTeam = teams.filter(t => t.players.includes(player))
    currentTeam.players.map(p => {
        io.to(p.id).emit('guessing')
    })
    io.to(room.currentPlayer.id).emit('playing')

    room.activeWords = room.words
    shuffleArray(room.activeWords)
    console.log(room.activeWords)
}

//Helper for finding room by socket
playerRoom = (socket) => {
    return gameState.rooms.find(r => r.id === socket.room)
}

//Methods
const joinRoom = (socket, room) => {
    room.sockets.push(socket)
    room.players.push(gameState.players.find(p => p.id === socket.id))
    socket.join(room.id, () => {
        socket.room = room.id
        console.log(socket.id, " joined ", room.id)
    })

    //Create new team for the player
    let team = {
        id: uuidv4(),
        players: [],
        points: 0
    }
    team.players.push(gameState.players.find(p => p.id === socket.id))

    //Team id assigned by first players id
    room.teams.push(team)

    //Emit view change and data to clients
    io.to(room.id).emit('roomTeams', room.teams)
    socket.emit('roomId', room.id)
    socket.emit('changeView', 'lobby')
}

joinTeam = (socket, teamId) => {
    let room = playerRoom(socket)
    let team = room.teams.find(t => t.id === teamId)
    let player = gameState.players.find(p => p.id === socket.id)

    //Make sure player isn't joining his own team
    if (!team.players.includes(player)) {
        team.players.push(player)
        
        //Remove player from any other teams
        room.teams.map(t => {
            if (t.players.includes(player) && t.id !== teamId) {
                t.players = t.players.filter(p => p !== player)
            }
        })

        //Remove empty teams
        room.teams = room.teams.filter(t => t.players.length > 0)
        io.to(socket.room).emit('roomTeams', room.teams)
    }
}

//Main socket.io Loop
io.on('connection', (socket) => {
    console.log(socket.id, " connected")

    socket.on('newPlayer', (username) => {
        gameState.players.push({
            id: socket.id,
            username: username
        })
    })

    socket.on('createRoom', () => {
        //Creates room with unique identifier
        let roomId = Math.random().toString(36).substring(2, 13);
        const room = {
            id: roomId,
            sockets: [],
            players: [],
            teams: [],
            leader: socket.id,
            words: [],
            activeWords: [],
            currentPlayer: {}
        }
        //Adds room to gamteState and joins the player to it
        gameState.rooms.push(room)
        joinRoom(socket, room)
        //Emit leader status to user
        socket.emit('leader')
    })

    socket.on('joinRoom', (roomId) => {
        let room = gameState.rooms.find(r => r.id === roomId)
        if (gameState.rooms.includes(room)) {
            joinRoom(socket, room)
        } else {
            socket.emit('error', 'Room doesn\'t exist.')
        }
    })

    socket.on('joinTeam', (teamId) => {
        joinTeam(socket, teamId)
    })

    socket.on('createTeam', () => {
        //Create team with current identifier and join the player to it
        teamId = uuidv4();
        let team = {
            id: teamId,
            players: [],
            points: 0
        }
        playerRoom(socket).teams.push(team)
        joinTeam(socket, teamId)
    })

    socket.on("startGame", () => {
        io.to(socket.room).emit('changeView', 'words')
        io.to(socket.room).emit('players', playerRoom(socket).players.length)
    })

    socket.on("addWord", (word) => {
        console.log(word)
        let words = playerRoom(socket).words

        //Push word to word array
        words.push({
            word: word,
            author: socket.id
        })
        
        //Player reached five words - can't add any more
        if (words.filter(w => w.author === socket.id).length === 5) {
            socket.emit('maxWords')
        }

        //Emit number of words to clients
        io.to(socket.room).emit('words', words.length)

        //If everyone added five words start first round
        if (words.length === playerRoom(socket).players.length * 5) {
            io.to(socket.room).emit('changeView', 'roundOne')
        }
    })

    socket.on('startRound', () => {
        startRound(socket)
    })

    socket.on('disconnect', () => {
        //Remove player from gameState
        gameState.players.filter(p => p.id != socket.id)
    })
})