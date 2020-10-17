const express = require('express')
const app = express()
const path = require('path')
const { v4: uuidv4} = require('uuid')
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
        id: socket.id,
        players: []
    }
    team.players.push(gameState.players[socket.id])
    //Team id assigned by first players id
    room.teams.push(team)
    //Emit view change and data to clients
    io.to(room.id).emit('roomTeams', room.teams)
    socket.emit('roomId', room.id)
    socket.emit('changeView', 'lobby')
}

//Main socket.io Loop
io.on('connection', (socket) => {
    console.log(socket.id, " connected")

    socket.on('newPlayer', (username) => {
        gameState.players[socket.id] = {
            username: username,
            points: 0
        }
    })

    socket.on('createRoom', () => {
        //Creates room with unique identifier
        let roomId = /*Math.random().toString(36).substring(2, 13)*/ 'A';
        const room = {
            id: roomId,
            sockets: [],
            players: [],
            teams: []
        }
        //Adds room to gamteState and joins the player to it
        gameState.rooms[room.id] = room
        joinRoom(socket, room)
    })

    socket.on('joinRoom', (roomId) => {
        joinRoom(socket, gameState.rooms[roomId])
    })

    socket.on('joinTeam', (teamId) => {
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
            io.to(socket.room).emit('roomTeams', room.teams)
        }
    })

    socket.on('disconnect', () => {
        gameState.players.filter(p => p.id != socket.id)
    })
})

