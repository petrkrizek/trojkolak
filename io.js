const express = require('express')
const app = express()
const path = require('path')

//Create server with heroku port or port 5000
const PORT = process.env.PORT || 5000

app.use('/', express.static(path.join(__dirname, 'client/build/')))
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require('socket.io').listen(server);
module.exports = io


