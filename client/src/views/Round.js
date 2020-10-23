import React from 'react'
import { socket } from '../socket'

export default class Round extends React.Component {
    startRound = () => {
        socket.emit('startRound')
    }

    render() {
        return (
            <div className="round">
                Round {this.props.roundNumber}

                <div className="round__timer">{this.props.time}</div>
                {this.props.playing && <button className="round__start" onClick={this.startRound}>Start round</button>}
            </div>
        )
    }
}