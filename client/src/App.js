import React from 'react'
import { socket } from './socket.js'

import Menu from './views/Menu'
import Lobby from './views/Lobby'
import Words from './views/Words'

class App extends React.Component {
	state = {
		view: 'menu',
		teams: [],
		roomId: '',
		leader: false,
		maxwords: false,
		words: 0,
		players: [],
		username: ''
	}

	componentDidMount() {
		socket.on('changeView', (view) => {
			this.setState({
				view: view
			})
		})
		
		socket.on('roomTeams', (teams) => {
			this.setState({
				teams: teams
			})
		})

        socket.on('roomId', (id) => {
            this.setState({
                roomId: id
            })
		})
		
		socket.on('leader', () => {
			this.setState({
				leader: true
			})
		})

		socket.on('words', (words) => {
			this.setState({
				words: words
			})
		})

		socket.on('maxWords', () => {
			this.setState({
				maxwords: true
			})
		})

		socket.on('players', (players) => {
			this.setState({
				players: players
			})
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
					roomId={this.state.roomId}
					leader={this.state.leader}
					username={this.state.username}
				/>
			}
			case "words": {
				return <Words 
					words={this.state.words}
					maxwords={this.state.maxwords}
					players={this.state.players.length}
				/>
			}
			default: {
				return 'error'
			}
		}
	}
}

export default App;
