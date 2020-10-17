import React from 'react'
import { socket } from "../../socket.js"

export default class CreateRoom extends React.Component {
    constructor(props) {
        super(props)
    }

    createRoom = () => {
        if (this.props.username === '') {
            socket.emit('newPlayer', 'guest')
        } else {
            socket.emit('newPlayer', this.props.username)
        }
        
        socket.emit('createRoom')
    }

    render() {
        return(
            <div className="createroom">
                <button className="createroom__button" onClick={this.createRoom}>Create Game</button>
            </div>
        )
    }
}

