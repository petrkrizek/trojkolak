import React from 'react'
import { socket } from "../../socket.js"

export default class CreateGame extends React.Component {
    render() {
        return(
            <div className="creategame">
                <button className="creategame__button" onClick={this.props.createGame}>Create Game</button>
            </div>
        )
    }
}

