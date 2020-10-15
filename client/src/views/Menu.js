import React from 'react'
import CreateRoom from '../components/menu/CreateRoom'

export default class Menu extends React.Component {
    constructor(props) {
        super()
    }

    render() {
        return (
            <div className="menu">
                <CreateRoom />
            </div>
        )
    }
}
