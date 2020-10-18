import React from 'react'
import CreateRoom from '../components/menu/CreateRoom'
import JoinRoom from '../components/menu/JoinRoom'

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
                <CreateRoom username={this.props.username} />
                <JoinRoom username={this.props.username}/>
            </div>
        )
    }
}
