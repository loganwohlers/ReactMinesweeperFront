import React from 'react'
import GameMenu from '../containers/GameMenu'
import SaveScore from './SaveScore'
import LeaderBoard from '../containers/LeaderBoard';

class NewGameMenu extends React.Component {
  render() {
    return (
      <div className='menu'>

        {this.props.won ?
          <div>
            <div className='finalScore'>FINAL SCORE: {this.props.time}</div>
            <SaveScore
              time={this.props.time}
              difficulty={this.props.difficulty}
            />
          </div>
          :
          <div className='finalScore'>
            YOU LOST!
             <LeaderBoard />
          </div>
        }

        <br />
        <div className='finalScore'>
          Play Again?
          </div>
        <GameMenu
          handleClick={this.props.restart}
          difficulty={this.props.difficulty} />


      </div>
    )
  }
}

export default NewGameMenu;
