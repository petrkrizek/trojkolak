import React from 'react'
import RoundTeam from '../components/round/RoundTeam'
import DrawingCanvas from '../components/round/DrawingCanvas'
import PreviewCanvas from '../components/round/PreviewCanvas'

export default class Round extends React.Component {
    render() {
        return (
            <div className="round">
                <div className="round__name">Round {this.props.roundNumber}</div>
                <div className="round__username">{this.props.username}</div>
                <div className="round__timer">{this.props.time}</div>
                {this.props.playing && !this.props.started && <button className="round__start" onClick={this.props.startRound}>Start round</button>}
                {this.props.playing && this.props.started && <button className="round__guessed" onClick={this.props.guessWord}>Guessed!</button>}
                {(this.props.playing || this.props.guessing) && this.props.started && <div className="round__word">{this.props.word}</div>}
                {this.props.playing ? (this.props.round === 3 && <DrawingCanvas />) : (this.props.round === 3 && <PreviewCanvas/>)}
                <div className="round__teams">
                    {this.props.teams.map(t => {
                        return <RoundTeam
                                    players={t.players}
                                    points={t.points}
                                />
                    })}
                </div>
            </div>
        )
    }
}