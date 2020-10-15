import React from 'react'
import { socket } from './socket.js'

import Menu from './views/Menu.js'

class App extends React.Component {
  constructor() {
    super()
    
    socket.emit('newPlayer', 'USER1')
  }

  render() {
    return (
      <div className="app">
        trojkolak
        <Menu />
      </div>
    )
  }
}

export default App;
