import React from 'react'

class SaveScore extends React.Component {

  updateDbScore = (e) => {
    e.preventDefault()
    let { time, difficulty } = this.props;
    let user_id;
    let username = e.target.children[0].children[0].value.toLowerCase();

    // FIND OR CREATE USER
    fetch('http://localhost:3000/users', {
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
      fetch('http://localhost:3000/games', {
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
  }

  render() {
    return (
      <div className='finalScore'>
      <hr/>
        Submit Score?
        <form id='submitForm' onSubmit={this.updateDbScore}>
          <label>
            Name:
            <br/>
            <input type='text' name='username' />
          </label>
          <input type='submit' />
        </form>
        <hr/>
      </div>
    )
  }
}

export default SaveScore
