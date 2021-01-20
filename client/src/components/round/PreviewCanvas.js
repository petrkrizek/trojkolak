
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


        socket.on('canvas-isdrawing', data => {
            this.setState({prevPos: data})
        })

        socket.on('canvas-draw', data => {
            const {offsetX, offsetY} = data
            const {offsetX: x, offsetY: y} = this.state.prevPos
            console.log(data)
            this.ctx.beginPath()
            this.ctx.strokeStyle = this.state.strokeStyle
            this.ctx.lineWidth = this.state.lineWidth
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(offsetX, offsetY)
            this.ctx.stroke()
            this.setState({
                prevPos: {offsetX, offsetY}
            })
        })

        socket.on('guessed', () => {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        })

        this.resizeCanvas()

        window.addEventListener('resize', () => {
            this.resizeCanvas()
        })
    }

    resizeCanvas = () => {
        this.ctx.canvas.width  = window.innerWidth / 100 * 60;
        this.ctx.canvas.height = window.innerWidth / 100 * 40;
    }

    render() {
        return (
            <div className="drawing">
                <canvas 
                    className="drawing__canvas"
                    ref={ref => this.canvas = ref}
                />
            </div>
        )
    }
}