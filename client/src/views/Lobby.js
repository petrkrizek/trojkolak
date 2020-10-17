import React from 'react'
import LobbyTeam from '../components/lobby/LobbyTeam'


export default class Lobby extends React.Component {
    state = {
        username: ''
    }

    componentDidMount() {
        console.log(this.props.teams)
    }

    render() {
        return (
            <div className="lobby">
                <h2 className="lobby__title">Lobby</h2>
                <div className="lobby__teams">
                    {this.props.teams.map(team => {
                        return <LobbyTeam team={team} />
                    })}
                </div>
                <div className="lobby__idlink">Game id: {this.props.roomId}</div>
            </div>
        )
    }
}