const io = require('socket.io-client')
const rw = require('random-words')

class Player {
    constructor(name) {
        this.socket = io.connect('http://localhost:5000')
        this.name = name
        this.teams = null
        this.gameId = null
        this.time = 0
        this.round = 0
        this.view = ''
        this.word = ''
        this.playing = false
        this.guessing = false
        this.socket.on('gameId', (id) => {
            this.gameId = id
        })
        this.socket.on('teams', teams => {
            this.teams = teams
        })
        this.socket.on('round', r => {
            this.round = r
        })
        this.socket.on('time', t => {
            this.time = t
        })
        this.socket.on('view', v => {
            this.view = v
        })
        this.socket.on('playing', word => {
            this.playing = true
            this.word = word

            window.setInterval(() => {
                if (this.time > 0) {
                    this.socket.emit('guessedWord')
                }
            }, 2000)
        })
        this.socket.on('guessing', () => {
            this.guessing = true
            console.log(this.name + 'is guessing')
        })
    }

    joinGame = (id) => {
        let gameId = id
        this.gameId = gameId
        this.socket.emit('joinGame', {gameId: this.gameId, username: this.name})
    }

    joinTeam = (teamId) => {
        this.socket.emit('joinTeam', teamId)
    }

    getGameId = () => {
        return this.gameId
    }
    
    addWords = () => {
        let words = rw(5)
        words.forEach(w => {
            this.socket.emit('addWord', w)
        })
    }
}

const players = [
    new Player('karel'),
    new Player('bredly'),
    new Player('kekmaster420')
]

setTimeout(() => {
    players.forEach(p => {
        p.joinGame('test')
    })
}, 1000)


setTimeout(() => {
    players.forEach(p => {
        p.addWords()
    })
    players[1].joinTeam(players[1].teams[0].id)
    players[2].joinTeam(players[1].teams[1].id)

    setTimeout(() => {
        while (true) {
            players.forEach(p => {
                if (p.playing) {
                    p.startRound()
                }
            })
        }
    }, 200)
}, 2000)
