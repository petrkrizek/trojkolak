import React from 'react'

export default class joinGame extends React.Component {
    state = {
        gameId: ''
    }

    

    render() {
        return(
            <div className="joingame">
                <input className="joingame__input" placeholder="Enter game id" onChange={this.props.gameIdChange}></input>
                <button className="joingame__button" onClick={this.props.joinGame}>Join Game</button>
            </div>
        )
    }
}

