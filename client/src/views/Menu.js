import React from 'react'
import CreateGame from '../components/menu/CreateGame'
import JoinGame from '../components/menu/JoinGame'

export default class Menu extends React.Component {
    render() {
        return (
            <div className="menu">
                <input
                    className="usernameInput"
                    placeholder="Enter username"
                    maxLength="20"
                    value={this.props.username}
                    onChange={this.props.handleChange}
                >                    
                </input>
                <CreateGame username={this.props.username} />
                <JoinGame username={this.props.username} />
            </div>
        )
    }
}
