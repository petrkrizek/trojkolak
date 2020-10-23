import React from 'react'
import { socket } from '../../socket.js'

export default class LobbyTeam extends React.Component {
    componentDidMount() {

    }

    joinTeam = () => {
        socket.emit('joinTeam', this.props.team.id)
    }

    leaveTeam = () => {
        socket.emit('leaveTeam')
    }

    render () {
        return (
            <div className="lobby__team">
                <div className="team__players" onClick={this.joinTeam}>


                    {this.props.team.players.map(player => {
                        return <div className="team__player" key={player.username}>{player.username === this.props.username ? player.username + ' (You)' : player.username}</div>
                    })}
                </div>
                {this.props.team.players.length > 1 && 
                <div className="team__leave" onClick={this.leaveTeam}>Leave team</div>}
            </div>
        )
    }

}