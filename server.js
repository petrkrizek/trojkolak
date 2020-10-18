const express = require('express')
const app = express()
const path = require('path')
const {v4:uuidv4} = require('uuid')
const PORT = process.env.PORT || 5000


app.use('/', express.static(path.join(__dirname, 'client/build/')))
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require('socket.io').listen(server);


//Game State
const gameState = {
    players: [],
    words: [],
    rooms: {}
}

//Methods
const joinRoom = (socket, room) => {
    room.sockets.push(socket)
    room.players.push(gameState.players[socket.id])
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
    team.players.push(gameState.players[socket.id])
    //Team id assigned by first players id
    room.teams.push(team)
    //Emit view change and data to clients
    io.to(room.id).emit('roomTeams', room.teams)
    socket.emit('roomId', room.id)
    socket.emit('changeView', 'lobby')
}

joinTeam = (socket, teamId) => {
    let room = gameState.rooms[socket.room]
    let team = room.teams.find(t => t.id === teamId)
    let player = gameState.players[socket.id]
    if (!team.players.includes(player)) {
        if (!team.players.includes(player)) {
            team.players.push(player)
        }
        room.teams.map(t => {
            if (t.players.includes(player) && t.id !== teamId) {
                t.players = t.players.filter(p => p !== player)
            }
        })

        room.teams = room.teams.filter(t => t.players.length > 0)
        io.to(socket.room).emit('roomTeams', room.teams)
    }
}

//Main socket.io Loop
io.on('connection', (socket) => {
    console.log(socket.id, " connected")

    socket.on('newPlayer', (username) => {
        gameState.players[socket.id] = {
            username: username
        }
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
            words: []
        }
        //Adds room to gamteState and joins the player to it
        gameState.rooms[room.id] = room
        joinRoom(socket, room)
        socket.emit('leader')
    })

    socket.on('joinRoom', (roomId) => {
        if (gameState.rooms[roomId]) {
            joinRoom(socket, gameState.rooms[roomId])
        } else {
            socket.emit('error', 'Room doesn\'t exist.')
        }
    })

    socket.on('joinTeam', (teamId) => {
        joinTeam(socket, teamId)
    })

    socket.on('createTeam', () => {
        teamId = uuidv4();
        let team = {
            id: teamId,
            players: [],
            points: 0
        }
        gameState.rooms[socket.room].teams.push(team)
        joinTeam(socket, teamId)
    })

    socket.on("startGame", () => {
        io.to(socket.room).emit('changeView', 'words')
        io.to(socket.room).emit('players', gameState.rooms[socket.room].players)
    })

    socket.on("addWord", (word) => {
        let words = gameState.rooms[socket.room].words

        words.push({
            word: word,
            author: socket.id
        })

        if (words.filter(w => w.author === socket.id).length === 5) {
            socket.emit('maxWords')
        }
        io.to(socket.room).emit('words', words.length)

        if (words.length === gameState.rooms[socket.room].players.length * 5) {
            io.to(socket.room).emit('changeView', 'roundOne')
        }
    })

    socket.on('disconnect', () => {
        gameState.players.filter(p => p.id != socket.id)
    })
})