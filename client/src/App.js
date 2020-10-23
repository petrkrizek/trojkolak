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
		playing: false,
		guessing: false,
		time: 0,
		word: '',
		error: ''
	}

	componentDidMount() {
		socket.on('view', (view) => {
			this.setState({
				view
			})
		})
		
		socket.on('teams', (teams) => {
			this.setState({
				teams
			})
		})

        socket.on('gameId', (gameId) => {
            this.setState({
                gameId
            })
		})
		
		socket.on('leader', () => {
			this.setState({
				leader: true
			})
		})

		socket.on('words', (words) => {
			this.setState({
				words
			})
		})

		socket.on('maxWords', () => {
			this.setState({
				maxwords: true
			})
		})

		socket.on('players', (players) => {
			this.setState({
				players
			})
		})

		socket.on('playing', () => {
			this.setState({
				playing: true
			})
		})

		socket.on('guessing', () => {
			this.setState({
				guessing: true
			})
		})

		socket.on('time', (time) => {
			this.setState({
				time
			})
		})

		socket.on('word', (word) => {
			this.setState({
				word
			})
		})

		socket.on('error', (error) => {
			this.setState({
				error
			})
			console.log(error)
		})
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
			case "roundOne": {
				return <Round
					playing={this.state.playing}
					guessing={this.state.guessing}
					word={this.state.word}
					time={this.state.time}
					roundNumber={1}
				/>
			}
			default: {
				return 'error'
			}
		}
	}
}

export default App;
