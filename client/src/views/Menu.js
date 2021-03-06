import React from 'react'
import CreateGame from '../components/menu/CreateGame'
import JoinGame from '../components/menu/JoinGame'

export default class Menu extends React.Component {
    render() {
        return (
            <div className="menu">
                <h1 className="menu__title">TROJKOLÁK</h1>
                <input
                    className="usernameInput"
                    placeholder="Enter username"
                    maxLength="20"
                    value={this.props.username}
                    onChange={this.props.handleChange}
                >                    
                </input>
                <CreateGame
                    username={this.props.username}
                    createGame={this.props.createGame}
                />
                <JoinGame 
                    username={this.props.username}
                    gameIdChange={this.props.gameIdChange}
                    joinGame={this.props.joinGame}
                />
            </div>
        )
    }
}
