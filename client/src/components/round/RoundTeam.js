import React from 'react'

export default class RoundTeam extends React.Component {
    render() {
        return (
            <div className="team">
                <ul className="team__players">
                    {this.props.players.map(p => {
                        return <li classname="team__player">{p.username}</li>
                    })}
                </ul>
                <div className="team__points">{this.props.points}</div>
            </div>
        )
    }
}