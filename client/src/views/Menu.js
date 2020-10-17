import React from 'react'
import CreateRoom from '../components/menu/CreateRoom'
import JoinRoom from '../components/menu/JoinRoom'

export default class Menu extends React.Component {
    state = {
        username: ''
    }

    handleChange = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    render() {
        return (
            <div className="menu">
                <input className="usernameInput" placeholder="Enter username" value={this.state.username} onChange={this.handleChange}></input>
                <CreateRoom username={this.state.username} />
                <JoinRoom username={this.state.username}/>
            </div>
        )
    }
}
