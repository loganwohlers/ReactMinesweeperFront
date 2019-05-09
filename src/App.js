import React from 'react';
import GameBoard from './containers/GameBoard'
import GameMenu from './containers/GameMenu'
import LeaderBoard from './containers/LeaderBoard'


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      difficulty: null
    }
    this.handleDifficultyClick = this.handleDifficultyClick.bind(this);
  }

  handleDifficultyClick(difficulty) {
    this.setState({ difficulty })
  }

  render() {
    return (
      <div className="App">
        {this.state.difficulty ?
          <GameBoard difficulty={this.state.difficulty} />
          :
          <>
            <GameMenu
              difficulty={this.state.difficulty}
              handleClick={this.handleDifficultyClick} />
            <LeaderBoard />
          </>
        }
      </div>
    )
  }
}

export default App;
