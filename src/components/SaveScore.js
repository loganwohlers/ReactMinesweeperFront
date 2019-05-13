import React from 'react'
import LeaderBoard from '../containers/LeaderBoard';

class SaveScore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: false
    }
  }

  updateDbScore = (e) => {
    e.preventDefault()
    let { time, difficulty } = this.props;
    let user_id;
    let username = e.target.children[0].children[1].value.toLowerCase();

    // FIND OR CREATE USER
    fetch('https://react-minesweeper-backend.herokuapp.com/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 'username': username })
    })
      .then((res) => res.json())
      .then(data => {
        user_id = data.id
      })

      // CREATE GAME
      .then(() => {
        fetch('https://react-minesweeper-backend.herokuapp.com/games', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            'user_id': user_id,
            'score': time,
            'difficulty': difficulty
          })
        })
      })
    this.setState({
      submitted: true
    })
  }

  render() {
    return (
      <div className='finalScore'>
        {!this.state.submitted ?
          <div>
            <hr />
            Submit Score?
            <form id='submitForm' onSubmit={this.updateDbScore}>
              <label>
                Name:
                <br />
                <input type='text' name='username' />
              </label>
              <input type='submit' />
            </form>
            <hr />
          </div>
          :
          <div>
            <br />
            <br />
            Score Submitted!
          <LeaderBoard newScore={true} />
          </div>}
      </div>

    )
  }
}

export default SaveScore
