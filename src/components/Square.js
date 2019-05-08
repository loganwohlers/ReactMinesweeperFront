import React from 'react'
import flag from '../assets/flag.png'
import mine from '../assets/mine.png'

class Square extends React.Component {

    handleClick = () => {
        this.props.handleSquareClick(this.props.coords)
    }

    handleFlag = (e) => {
        e.preventDefault()
        if (!this.props.revealed) {
            this.props.handleFlagClick(e, this.props.coords)
        }
    }

    determineCSS() {
        if (this.props.flagged) {
            return 'flaggedSquare'
        } else if (this.props.revealed || (this.props.gameOver && this.props.data === 'b')) {
            return 'clickedSquare'
        } else {
            return 'unclickedSquare'
        }
    }

    determineContent() {
        if (this.props.flagged) {
            return <img className='flag' src={flag} alt='' />
        } else if (this.props.gameOver && this.props.data === 'b') {
            return <img className='mine' src={mine} alt='' />
        } else {
            return this.props.data
        }
    }

    render() {
        return (
            <td >
                <div
                    className="square"
                    onClick={this.handleClick}
                    onContextMenu={this.handleFlag}>
                    <div className={this.determineCSS()}>
                        {this.determineContent()}
                    </div>
                </div>
            </td >
        )
    }
}

export default Square;
