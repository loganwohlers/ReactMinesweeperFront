import React from 'react'
import Timer from './Timer'

class GameInfoBar extends React.Component {
  render() {
    return (
      <div className='menu' id='infoBar'>
        Mines Left: {this.props.mines}
        <Timer
          gameOver={this.props.gameOver}
          activeTimer={this.props.activeTimer}
          returnTimer={this.props.returnTimer} />
      </div>
    )
  }
}

export default GameInfoBar
