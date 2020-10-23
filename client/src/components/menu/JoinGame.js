import React from 'react'
import { socket } from "../../socket.js"

export default class joinGame extends React.Component {
    state = {
        gameId: ''
    }

    handleChange = (e) => {
        this.setState({
            gameId: e.target.value
        })
    }

    joinGame = () => {
        socket.emit('joinGame', {
            gameId: this.state.gameId, 
            username: this.props.username
        })
    }

    render() {
        return(
            <div className="joingame">
                <input className="joingame__input" placeholder="Enter game id" onChange={this.handleChange}></input>
                <button className="joingame__button" onClick="play" onClick={this.joinGame}>Join Game</button>
            </div>
        )
    }
}

