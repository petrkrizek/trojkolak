import React from 'react'
import RoundTeam from '../components/round/RoundTeam'

export default class Round extends React.Component {
    render() {
        return (
            <div className="round">
                Round {this.props.roundNumber}
                <div className="round__username">{this.props.username}</div>
                <div className="round__timer">{this.props.time}</div>
                {this.props.playing && !this.props.started && <button className="round__start" onClick={this.props.startRound}>Start round</button>}
                {this.props.playing && this.props.started && <button className="round__start" onClick={this.props.guessWord}>Guessed!</button>}
                {this.props.playing && this.props.started && <div className="round__word">{this.props.word}</div>}
                {this.props.teams.map(t => {
                    return <RoundTeam
                                players={t.players}
                                points={t.points}
                            />
                })}

            </div>
        )
    }
}