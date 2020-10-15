import React from 'react'
import { socket } from "../../socket.js"

export default class CreateRoom extends React.Component {
    constructor(props) {
        super()
        this.state = {
            roomName: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            roomName: e.target.value
        })
    }

    createRoom = () => {
        socket.emit('createRoom', this.state.roomName)
        this.setState({
            roomName: ''
        })
    }

    render() {
        return(
            <div className="createroom">
                <input className="createroom__input" type="text" value={this.state.roomName} onChange={this.handleChange}></input>
                <button className="createroom__button" onClick={this.createRoom}>Create Room</button>
            </div>
        )
    }
}

