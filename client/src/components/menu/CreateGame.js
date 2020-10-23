import React from 'react'
import { socket } from "../../socket.js"

export default class CreateGame extends React.Component {
    createGame = () => {
        if (this.props.username !== '') {
            socket.emit('createGame', this.props.username)
        }
    }

    render() {
        return(
            <div className="creategame">
                <button className="creategame__button" onClick={this.createGame}>Create Game</button>
            </div>
        )
    }
}

