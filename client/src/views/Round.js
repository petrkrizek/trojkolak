import React from 'react'
import RoundTeam from '../components/round/RoundTeam'
import DrawingCanvas from '../components/round/DrawingCanvas'
import PreviewCanvas from '../components/round/PreviewCanvas'

export default class Round extends React.Component {
    componentDidMount() {

        window.addEventListener('keydown', e => {
            if (this.props.playing && this.props.started && e.keyCode === 32) {
                this.props.guessWord()
            }
        })

    }
    
    render() {
        return (
            <div className="round" >
                <div className={this.props.round === 3 ? 'round__name round__name--drawing' : 'round__name'}>Round {this.props.roundNumber}</div>
                <div className={this.props.round === 3 ? 'round__username round__username--drawing' : 'round__username'}>{this.props.username}</div>
                {this.props.playing && this.props.started && this.props.round === 3 && <DrawingCanvas />}
                {this.props.round === 3 && !this.props.playing && <PreviewCanvas />}
                <div className={this.props.round === 3 ? 'round__timer round__timer--drawing' : 'round__timer'}>{this.props.time}</div>
                {this.props.playing && !this.props.started && <button className={this.props.round === 3 ? 'round__start round__start--drawing' : 'round__start'} onClick={this.props.startRound}>Start round</button>}
                {this.props.playing && this.props.started && <button className={this.props.round === 3 ? 'round__guessed round__guessed--drawing' : 'round__guessed'} onClick={this.props.guessWord}>Guessed!</button>}
                {(this.props.playing) && this.props.started && <div className={this.props.round === 3 ? 'round__word round__word--drawing' : 'round__word'}>{this.props.word}</div>}
                <div className={(this.props.playing && this.props.round === 3) ? 'round__teams round__teams--drawing' : 'round__teams'}>
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