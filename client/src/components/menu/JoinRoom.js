import React from 'react'
import { socket } from "../../socket.js"

export default class JoinRoom extends React.Component {
    state = {
        roomId: ''
    }

    handleChange = (e) => {
        this.setState({
            roomId: e.target.value
        })
    }

    joinRoom = () => {
        socket.emit('newPlayer', this.props.username)
        socket.emit('joinRoom', this.state.roomId)
    }

    render() {
        return(
            <div className="joinroom">
                <input className="joinroom__input" placeholder="Enter game id" onChange={this.handleChange}></input>
                <button className="joinroom__button" onClick="play" onClick={this.joinRoom}>Join Game</button>
            </div>
        )
    }
}

