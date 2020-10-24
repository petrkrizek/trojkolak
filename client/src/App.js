import React from 'react'
import { socket } from './socket.js'

import Menu from './views/Menu'
import Lobby from './views/Lobby'
import Words from './views/Words'
import Round from './views/Round'

class App extends React.Component {
	state = {
		view: 'menu',
		teams: [],
		gameId: '',
		leader: false,
		maxwords: false,
		words: 0,
		players: 0,
		username: '',
		round: 0,
		playing: false,
		guessing: false,
		started: false,
		time: 0,
		word: '',
		error: '',		
	}

	componentDidMount() {
		if (localStorage.getItem('gameId')) {
			socket.emit('reconnect')
		}

		socket.on('view', view => {
			this.setState({
				view
			})
		})

		socket.on('round', round => {
			this.setState({
				round: round
			})
			if (round > 1) {
				this.setState({
					started: false
				})
			}
		})
		
		socket.on('teams', teams => {
			this.setState({
				teams
			})
		})

        socket.on('gameId', gameId => {
            this.setState({
                gameId
            })
		})
		
		socket.on('leader', () => {
			this.setState({
				leader: true
			})
		})

		socket.on('words', words => {
			this.setState({
				words
			})
		})

		socket.on('maxWords', () => {
			this.setState({
				maxwords: true
			})
		})

		socket.on('players', players => {
			this.setState({
				players
			})
		})

		socket.on('playing', word => {
			this.setState({
				playing: true,
				word: word
			})
		})

		socket.on('guessing', () => {
			this.setState({
				guessing: true
			})
		})

		socket.on('time', time => {
			this.setState({
				time
			})
		})

		socket.on('nextRound', () => {
			this.setState({
				playing: false,
				guessing: false,
				word: ''
			})
		})

		socket.on('error', error => {
			this.setState({
				error
			})
			console.log(error)
		})
	}
  
	createGame = () => {
        if (this.props.username !== '') {
			socket.emit('createGame', this.state.username)
			localStorage.setItem('gameId', this.state.gameId)
		}
		
	}
	
	gameIdChange = (e) => {
        this.setState({
            gameId: e.target.value
        })
    }

    joinGame = () => {
        socket.emit('joinGame', {
            gameId: this.state.gameId, 
            username: this.state.username
		})
		localStorage.setItem('gameId', this.state.gameId)
    }

	startRound = () => {
		socket.emit('startRound')
		this.setState({
			started: true
		})
	}

	guessWord = () => {
		socket.emit('guessedWord')
	}

	usernameChange = (e) => {
		this.setState({
			username: e.target.value
		})
	}

	render() {
		switch(this.state.view) {
			case "menu": {
				return <Menu 
					handleChange={this.usernameChange}
					username={this.state.username}
					createGame={this.createGame}
					joinGame={this.joinGame}
					gameIdChange={this.gameIdChange}
				/>
			}
			case "lobby": {
				return <Lobby 
					teams={this.state.teams}
					gameId={this.state.gameId}
					leader={this.state.leader}
					username={this.state.username}
				/>
			}
			case "words": {
				return <Words 
					words={this.state.words}
					maxwords={this.state.maxwords}
					players={this.state.players}
				/>
			}
			case "round": {
				return <Round
					playing={this.state.playing}
					guessing={this.state.guessing}
					word={this.state.word}
					time={this.state.time}
					roundNumber={this.state.round}
					username={this.state.username}
					teams={this.state.teams}
					startRound={this.startRound}
					guessWord={this.guessWord}

				/>
			}
			default: {
				return 'error'
			}
		}
	}
}

export default App;
