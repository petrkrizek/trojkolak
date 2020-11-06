
import React from 'react'
import {socket} from '../../socket'

export default class DrawingCanvas extends React.Component {
    state = {
        strokeStyle: '#000000',
        lineWidth: 5,
        isPainting: false,
        prevPos: {offsetX: 0, offsetY: 0}
    }

    componentDidMount = () => {
        this.canvas.width = 200
        this.canvas.height = 200
        this.ctx = this.canvas.getContext('2d')
        this.ctx.lineJoin = 'round'
        this.ctx.lineCap = 'round'
    }

    onMouseDown = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent
        socket.emit('canvas-isdrawing', {x: offsetX, y: offsetY})
        this.setState({
            isPainting: true,
            prevPos: {offsetX, offsetY}
        })
    }

    onMouseMove = ({nativeEvent}) => {
        if (this.state.isPainting) {
            const {offsetX, offsetY} = nativeEvent
            const offsetData = {offsetX, offsetY}
            this.paint(offsetData)
        }
    }

    endPaintEvent = () => {
        if (this.state.isPainting) {
            this.setState({isPainting: false})
        }
    }

    paint = (currPos) => {
        socket.emit('canvas-draw', currPos)
        const {offsetX, offsetY} = currPos
        const {offsetX: x, offsetY: y} = this.state.prevPos

        this.ctx.beginPath()
        this.ctx.strokeStyle = this.state.strokeStyle
        this.ctx.lineWidth = this.state.lineWidth
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(offsetX, offsetY)
        this.ctx.stroke()
        this.setState({
            prevPos: {offsetX, offsetY}
        })
    }

    render() {
        return (
            <div className="drawing">
                <canvas 
                    className="drawing__canvas"
                    ref={ref => this.canvas = ref}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.endPaintEvent}
                    onMouseLeave={this.endPaintEvent}
                    onMouseMove={this.onMouseMove}
                />
            </div>
        )
    }
}