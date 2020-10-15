import React from 'react';

import './App.css';

import io from 'socket.io-client'

class App extends React.Component {
  constructor() {
    super()
    const socket = io('localhost:5000')
    socket.emit('newPlayer', 'USER1')
  }

  render() {
    return (
      <div className="app">
        trojkolak
      </div>
    )
  }
}

export default App;
