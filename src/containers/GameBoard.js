import React from 'react'
import Square from '../components/Square'
import GameInfoBar from '../components/GameInfoBar'
import NewGameMenu from '../components/NewGameMenu'

class GameBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: [],
      mines: 0,
      gameOver: false,
      won: false,
      time: 0,
      activeTimer: false,
      difficulty: ''
    }
  }

  componentDidMount() {
    this.determineBoard(this.props.difficulty)
  }

  determineBoard = (difficulty) => {
    let newGrid, mines;
    if (difficulty === "intermediate") {
      newGrid = Array(16).fill().map(() => new Array(16).fill(0))
      mines = 40
    } else if (difficulty === "difficult") {
      newGrid = Array(22).fill().map(() => new Array(22).fill(0))
      mines = 99
    } else {
      newGrid = Array(9).fill().map(() => new Array(9).fill(0))
      mines = 10
    }

    this.setState({
      grid: newGrid,
      mines,
      difficulty
    }, () => {
      this.randomMines()
    })
  }

  randomMines() {
    let mines = 0
    let copyGrid = [...this.state.grid]

    while (mines < this.state.mines) {
      let x = Math.floor(Math.random() * this.state.grid.length)
      let y = Math.floor(Math.random() * this.state.grid.length)
      if (copyGrid[x][y] === 0) {
        copyGrid[x][y] = 'b'
        mines++
      }
    }
    this.setState({ grid: copyGrid }, () => this.setNeighborCount())
  }

  //reassigns the values in the state grid to accuratly reflect the number of mines contained in neighboring tiles
  setNeighborCount() {
    let copyGrid = [...this.state.grid]
    for (var i = 0; i < copyGrid.length; i++) {
      for (var j = 0; j < copyGrid.length; j++) {
        if (copyGrid[i][j] !== 'b') {
          copyGrid[i][j] = this.neighborMines(i, j, copyGrid)
        }
      }
    }
    this.setState({ grid: copyGrid })
  }

  //checks- through a copy of the current state grid- the value of all neighboring tiles and returns # of mines
  neighborMines(x, y, copyGrid) {
    let bombCount = 0
    let poss = this.generatePossibilities(x, y)
    for (var i = 0; i < poss.length; i++) {
      let xx = poss[i][0]
      let yy = poss[i][1]
      let coords = (copyGrid[xx][yy])
      if (coords === 'b') {
        bombCount++
      }
    }
    return bombCount
  }

  //uses a 2d array of the 8 possible tiles around any given x,y coordinate and
  //then filters out those which could not exist on currents state's board length
  generatePossibilities(x, y) {
    let all = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1]
    ]
    return all.filter((coords, i) => {
      let xx = all[i][0]
      let yy = all[i][1]
      return (xx >= 0 && yy >= 0 && xx < this.state.grid.length && yy < this.state.grid.length)
    })
  }

  //breadth first search to "click" all suitable 0 tiles and reveal all suitable # tiles
  handleSquareClick = (coords) => {
    if (!this.state.gameOver) {
      let currentValue = this.state.grid[coords[0]][coords[1]]
      let newGrid;
      // bomb click
      if (currentValue === 'b') {
        this.setState({
          gameOver: true,
          activeTimer: false
        })
        return null;

        // empty square click
      } else if (currentValue === 0) {
        newGrid = this.handleZeroSquareClick(coords)
        // number square click
      } else {
        newGrid = [...this.state.grid]
        newGrid[coords[0]][coords[1]] = currentValue + "*"
      }
      this.setState({ grid: newGrid }, () => this.winCheck())
    }
  }

  //this whole method needs to be cleaned up a bit
  handleZeroSquareClick = (coords) => {
    let copyGrid = [...this.state.grid]
    let visited = {}
    visited[coords] = true
    let queue = [coords]

    while (queue.length > 0) {
      let current = queue.pop()

      if (copyGrid[current[0]][current[1]] === 0) {
        // grid shows first character - need blank space
        copyGrid[current[0]][current[1]] = ' *'
      }

      //grab all possibile neighboring tiles
      let poss = this.generatePossibilities(current[0], current[1])

      // filter possibilities for number tile and reveal them
      let neighborNums = poss.filter(n => copyGrid[n[0]][n[1]] !== 0)
      neighborNums.forEach(ss => {
        let currValue = copyGrid[ss[0]][ss[1]]
        // * is revealed
        copyGrid[ss[0]][ss[1]] = currValue + "*"
      })

      //filter for suitable 0/blank tiles and visit them on search
      let neighborBlanks = poss.filter(n => copyGrid[n[0]][n[1]] === 0)
      for (let i = 0; i < neighborBlanks.length; i++) {
        if (!visited[neighborBlanks[i]]) {
          queue.push(neighborBlanks[i])
          visited[neighborBlanks[i]] = true
        }
      }
    }
    return copyGrid;
  }

  handleFlagClick = (e, coords) => {
    if (!this.state.gameOver) {
      let mines = this.state.mines
      let copyGrid = [...this.state.grid];
      let stringValue = copyGrid[coords[0]][coords[1]] + '';
      //remove flag
      if (stringValue.includes('F')) {
        mines++;
        copyGrid[coords[0]][coords[1]] = stringValue.slice(0, 1)
        //adding flag
      } else {
        mines--;
        copyGrid[coords[0]][coords[1]] += 'F'
      }

      this.setState({
        grid: copyGrid,
        mines
      }, () => this.winCheck()
      )
    }
  }

  winCheck = () => {
    if (this.state.mines === 0) {
      for (let i = 0; i < this.state.grid.length; i++) {
        for (let j = 0; j < this.state.grid.length; j++) {
          let currValue = this.state.grid[i][j] + ''
          if (!(currValue.includes('*') || currValue === 'bF')) {
            return false
          }
        }
      }
      this.setState({ active: false, gameOver: true, won: true })
      return true
    }
    return false;
  }

  // only starts timer
  startTimer = () => {
    if (!this.state.gameOver) {
      this.setState({ activeTimer: true })
    }
  }

  restartGame = (difficulty) => {
    this.setState({
      gameOver: false,
      activeTimer: true,
    }, () => {
      this.determineBoard(difficulty)
    })
    //reset timer
  }

  returnTimer = (time) => {
    if (this.state.gameOver) {
      this.setState({ time })
    }
  }

  render() {
    //render the current board via passing in values from state grid to Square components and
    //arranging them in a table
    const gameGrid = this.state.grid.map((row, i) => {
      return (
        <tr key={"row" + i}>
          {row.map((col, j) => {
            let revealed = false;
            let flagged = false;
            let currentValue = this.state.grid[i][j].toString()
            currentValue.includes('*') ? revealed = true : revealed = false
            currentValue.includes('F') ? flagged = true : flagged = false
            return (
              <Square
                key={i + ":" + j}
                revealed={revealed}
                data={currentValue.charAt(0)}
                flagged={flagged}
                gameOver={this.state.gameOver}
                coords={[i, j]}
                handleSquareClick={this.handleSquareClick}
                handleFlagClick={this.handleFlagClick} />
            )
          })}
        </tr>
      )
    })

    return (
      <div>
        <GameInfoBar
          mines={this.state.mines}
          gameOver={this.state.gameOver}
          activeTimer={this.state.activeTimer}
          returnTimer={this.returnTimer} />
        <table cellSpacing="0" id="gameBoard" onMouseEnter={this.startTimer} >
          <tbody>
            {gameGrid}
          </tbody>
        </table>
        {this.state.gameOver ?
          <>
            <NewGameMenu
              won={this.state.won}
              difficulty={this.state.difficulty}
              restart={this.restartGame}
              time={this.state.time}
            />
          </>
          : null}

      </div>
    )

  }
}

export default GameBoard;
