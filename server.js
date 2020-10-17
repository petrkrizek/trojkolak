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
    teams: [],
    words: [],
    rooms: []
}

//Methods
const joinRoom = (socket, room) => {
    room.sockets.push(socket)
    room.players.push(gameState.players[socket.id])
    socket.join(room.id, () => {
        socket.room = room.id
        console.log(socket.id, " joined ", room.id)
        console.log(gameState.rooms)
    })
    socket.emit('changeView', 'lobby')
    io.to(room.id).emit('roomPlayers', room.players)
    socket.emit('roomId', room.id)
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
        let roomId = Math.random().toString(36).substring(2, 13);
        const room = {
            id: roomId,
            sockets: [],
            players: []
        }
        //Adds room to gamteState and joins the player to it
        gameState.rooms[room.id] = room
        joinRoom(socket, room)
    })

    socket.on('joinRoom', (roomId) => {
        //console.log(gameState.rooms[roomId])
        joinRoom(socket, gameState.rooms[roomId])
    })

    socket.on('disconnect', () => {
        gameState.players.filter(p => p.id != socket.id)
        console.log(gameState.players)
    })
})

