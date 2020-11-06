import React from 'react'

export default class CreateGame extends React.Component {
    render() {
        return(
            <div className="creategame">
                <button className="creategame__button" onClick={this.props.createGame}>Create Game</button>
            </div>
        )
    }
}

