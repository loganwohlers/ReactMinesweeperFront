import React from 'react'

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.activeTimer && this.props.activeTimer) {
            this.startTimer()
        } else if (!prevProps.gameOver && this.props.gameOver) {
            this.props.returnTimer(this.state.time)
            clearInterval(this.interval)
        }
    }

    startTimer = () => {
        let time = 0
        this.interval = setInterval(() => {
            this.setState({
                time
            })
            time++;
        }, 1000)
    }

    render() {
        return (
            <div>
                Time: {this.state.time}
            </div>
        )
    }
}
export default Timer;
