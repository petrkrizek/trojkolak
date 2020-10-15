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
    socket.join(room.id, () => {
        socket.room = room.id
        console.log(socket.id, " joined ", room.id)
        console.log(gameState.rooms)
    })
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

    socket.on('createRoom', (roomName) => {
        //Creates room with unique identifier
        const room = {
            id: uuidv4(),
            name: roomName,
            sockets: []
        }
        //Adds room to gamteState and joins the player to it
        gameState.rooms[room.id] = room
        joinRoom(socket, room)
        
    })
})

