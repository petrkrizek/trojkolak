import React from 'react'
import { socket } from '../socket'

export default class Words extends React.Component {
    state = {
        wordInput: ''
    }

    handleChange = (e) => {
        this.setState({
            wordInput: e.target.value
        })
    }

    addWord = () => {
        socket.emit('addWord', this.state.wordInput)
        this.setState({
            wordInput: ''
        })
    }

    handleKey = (e) => {
        if (e.key === 'Enter') {
            this.addWord()
        }
    }

    render() {
        return (
            <div className="words">
                <input
                    className="words__input"
                    placeholder="Word" maxLength="30"
                    value={this.state.wordInput}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKey}
                    disabled={this.props.maxwords}
                >
            
                </input>
                <button className="words__add" onClick={this.addWord} disabled={this.props.maxwords}>Add</button>

                <div className="progress">
                    <div className="progress__bar">
                        <div className="progress__filler" style={{width: `${(this.props.words / (this.props.players * 5)) * 100}%`}}></div>
                    </div>
                </div>
            </div>
        )
    }
}