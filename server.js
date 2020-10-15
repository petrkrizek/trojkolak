const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000


app.use('/', express.static(path.join(__dirname, 'client/build/')))
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require('socket.io').listen(server);


const gameState = {
    players: [],
    teams: [],
    words: []
}

io.on('connection', (socket) => {
    socket.on('newPlayer', (username) => {
        gameState.players[socket.id] = {
            username: username,
            points: 0
        }

        console.log(gameState)
    })
})