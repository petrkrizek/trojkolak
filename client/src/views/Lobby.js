import React from 'react'
import LobbyTeam from '../components/lobby/LobbyTeam'
import { socket } from '../socket'


export default class Lobby extends React.Component {
    state = {
        username: ''
    }

    componentDidMount() {
        console.log(this.props.teams)
    }

    startGame = () => {
        socket.emit('startGame')
    }

    render() {
        return (
            <div className="lobby">
                <h2 className="lobby__title">Lobby</h2>
                <div className="lobby__teams">
                    {this.props.teams.map(team => {
                        return <LobbyTeam key={team.id} username={this.props.username} team={team} />
                    })}
                    
                </div>
                {this.props.leader && <button className="lobby__start" onClick={this.startGame}>Start game</button> }
                <div className="lobby__idlink">{this.props.gameId}</div>
            </div>
        )
    }
}