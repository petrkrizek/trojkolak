import React from 'react'
import { socket } from '../../socket.js'

export default class LobbyTeam extends React.Component {
    componentDidMount() {

    }

    joinTeam = () => {
        socket.emit('joinTeam', this.props.team.id)
    }

    render () {
        return (
            <div className="lobby__team" onClick={this.joinTeam}>
                {this.props.team.players.map(player => {
                    return <div className="team__player" onClick={this.joinTeam}>{player.username}</div>
                })}
            </div>
        )
    }

}