import React from 'react'
import { socket } from './socket.js'

import Menu from './views/Menu.js'
import Lobby from './views/Lobby.js'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			view: 'menu',
			roomPlayers: [],
			roomId: ''
		}

		socket.on('changeView', (view) => {
			this.setState({
				view: view
			})
		})


		socket.on('roomPlayers', (players) => {
            this.setState({
                roomPlayers: players
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
					roomPlayers={this.state.roomPlayers}
					roomId={this.state.roomId}
				/>
			}
		}
	}
}

export default App;
