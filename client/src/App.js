import React from 'react'
import { socket } from './socket.js'

import Menu from './views/Menu.js'
import Lobby from './views/Lobby.js'

class App extends React.Component {
	state = {
		view: 'menu',
		teams: [],
		roomId: ''
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
	}



	render() {
		switch(this.state.view) {
			case "menu": {
				return <Menu />
			}
			case "lobby": {
				return <Lobby 
					teams={this.state.teams}
					roomId={this.state.roomId}
				/>
			}
		}
	}
}

export default App;
