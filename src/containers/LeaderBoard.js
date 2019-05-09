import React from 'react'
import Score from '../components/Score'

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      beginner: [],
      intermediate: [],
      difficult: []
    }
  }

  componentDidMount() {
    fetch('https://react-minesweeper-backend.herokuapp.com/games', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
      .then((res) => res.json())
      .then(scores => {
        this.setScoresState(scores)
      })
  }

  setScoresState = (scores) => {
    let scoreLevels = {
      beginner: [],
      intermediate: [],
      difficult: []
    }

    scores.forEach(score => {
      scoreLevels[score.difficulty.toLowerCase()].push(score)
    })

    this.setState({
      beginner: scoreLevels.beginner,
      intermediate: scoreLevels.intermediate,
      difficult: scoreLevels.difficult
    })
  }



  render() {
    return (
      <div>
        <h2 id='leaderTitle'>LEADERBOARD</h2>
        <div className='leaderboard'>
          <Score
            scores={this.state.beginner}
            difficulty='beginner' />
          <Score
            scores={this.state.intermediate}
            difficulty='intermediate' />
          <Score
            scores={this.state.difficult}
            difficulty='difficult' />
        </div >
      </div>
    )
  }
}

export default LeaderBoard
    // < ul >
    //
