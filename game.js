const io = require('./io.js')
const {v4:uuidv4} = require('uuid')

class Game {
    constructor() {
        this.id = Math.random().toString(36).substring(2, 13);
        this.wordCount = 5
        this.time = 60
        this.leader = ''
        this.state = {
            players: [],
            teams: [],
            words: [],
            activeWords: []
        }
    }

    joinTeam(teamId, playerId) {
        let {players, teams} = this.state
        let team = teams.find(t => t.id === teamId)
        let player = players.find(p => p.id === playerId)

        //Add player to team if he isn't there already
        if (!team.players.includes(player)) {
            team.players.push(player)
        }

        //Remove player from any other teams
        teams.map(t => {
            if (t.players.includes(player) && t.id !== teamId) {
                t.players = t.players.filter(p => p !== player)
            }
        })

        //Remove empty teams
        teams = teams.filter(t => t.players.length > 0)
        io.to(this.id).emit('teams', teams)
    }

    addPlayer(playerId, username) {
        this.state.players.push({
            id: playerId,
            username: username
        })
        
        this.makeTeam(playerId)
        
        io.to(playerId)
            .emit('view', 'lobby')
            .emit('gameId', this.id)
    }

    makeTeam(playerId) {
        let teamId = uuidv4()
        this.addTeam(teamId)
        this.joinTeam(teamId, playerId)
    }

    addTeam(id) {
        this.state.teams.push({
            id: id,
            players: [],
            points: 0
        })

        io.to(this.id).emit('teams', this.state.teams)
    }

    start() {
        if (this.validateTeams()) {
            io.to(this.id)
                .emit('view', 'words')
                .emit('players', this.state.players.length) 
        }
    }

    validateTeams() {
        let {teams} = this.state

        if (teams.length === 1) {
            io.to(this.id).emit('error', 'oneteam')
            return false
        }

        teams.map(t => {
            if (t.players.length < 2) {
                io.to(this.id).emit('error', 'oneplayer')
                return false
            }
        })
        return true
    }

    addWord(text, playerId) {
        let {words, players} = this.state
        
        //Limit player from adding more than five words
        if (words.filter(w => w.author === playerId).length <= 5) {
            this.state.words.push({
                text: text,
                author: playerId
            })

            io.to(this.id).emit('words', words.length)
        }
        if (words.filter(w => w.author === playerId).length === 5) {
            io.to(playerId).emit('maxWords')
        }

        if (words.length === players.length * this.wordCount) {
            this.startRound()
        }
    }

    startRound() {
        console.log('round start')
    }
}

module.exports = Game