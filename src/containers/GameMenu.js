import React from 'react'
import LeaderBoard from './LeaderBoard'

class GameMenu extends React.Component {
    constructor(props) {
        super(props)

        this.handleChoice = this.handleChoice.bind(this)
    }

    handleChoice(event) {
        const difficulty = event.target.innerText.toLowerCase();
        this.props.handleClick(difficulty)
    }

    render() {
        return (
            <>
                <div className='menu'>
                    <p id='chooseDiff'>Choose Difficulty:</p>
                    <p className='diffButtons' onClick={this.handleChoice}>Beginner</p>{' '}
                    <p className='diffButtons' onClick={this.handleChoice}>Intermediate</p>{' '}
                    <p className='diffButtons' onClick={this.handleChoice}>Difficult</p>
                </div>
                <LeaderBoard />
            </>
        )
    }
}

export default GameMenu;
