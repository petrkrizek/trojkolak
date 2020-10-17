import React from 'react'

import { socket } from '../socket.js'

export default class Lobby extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            team: '',
            ready: false
        }
    }

    render() {
        return (
            <div className="lobby">
                Lobby, roomId = {this.props.roomId}
                <div className="players">
                    players:
                    <ul>
                        {this.props.roomPlayers.map((player) => {
                            return <li>{player.username}</li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}