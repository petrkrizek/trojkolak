import React from 'react'

export default class Round extends React.Component {
    render() {
        return (
            <div className="round">
                Round {this.props.roundNumber}

                <div className="round__timer">{this.props.time}</div>
            </div>
        )
    }
}