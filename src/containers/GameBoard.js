import React from 'react'
import Square from '../components/Square'
import GameInfoBar from '../components/GameInfoBar'
import NewGameMenu from '../components/NewGameMenu'

class GameTile {
 constructor() {
   this.isFlagged = false;
   this.isRevealed = false;
   this.isBomb = false;
   this.adjacentCount = -1;
 }

 isClickable() {
   return !this.isFlagged && !this.isRevealed;
 }
}

class GameBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: [],
      mines: 0,
      revealed: 0,

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
      newGrid = this.makeGrid(16)
      mines = 40
    } else if (difficulty === "difficult") {
      newGrid = this.makeGrid(22)
      mines = 99
    } else {
      newGrid = this.makeGrid(9)
      mines = 10
    }

    let gridArea = Math.pow(newGrid.length, 2)
    this.setState({
      grid: newGrid,
      mines,
      activeTimer: true,
      difficulty,
      revealed: gridArea - mines
    }, () => {
      this.randomMines()
    })
  }

  makeGrid(num) {
    let grid = new Array(num)

    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(num)
      for (let j = 0; j < grid.length; j++) {
        grid[i][j] = new GameTile()
      }
    }
    return grid
  }

  randomMines() {
    let mines = 0
    let copyGrid = [...this.state.grid]

    while (mines < this.state.mines) {
      let x = Math.floor(Math.random() * this.state.grid.length)
      let y = Math.floor(Math.random() * this.state.grid.length)
      if (!copyGrid[x][y].isBomb) {
        copyGrid[x][y].isBomb = true;
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
        if (!copyGrid[i][j].isBomb) {
          copyGrid[i][j].adjacentCount = this.neighborMines(i, j, copyGrid)
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
      let currTile = (copyGrid[xx][yy])
      if (currTile.isBomb) {
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
      let currentTile = this.state.grid[coords[0]][coords[1]]
      // bomb click
      if (currentTile.isClickable()) {
        if (currentTile.isBomb) {
          currentTile.isRevealed = true;
          this.setState({
            gameOver: true,
            activeTimer: false
          })
        } else {
          this.processNonMineClick(coords)
        }
      }
    }
  }

  //this used to be handlezerosquareclick
  processNonMineClick = (coords) => {
    let copyGrid = [...this.state.grid]
    let revealed = this.state.revealed
    let visited = {}
    let queue = [coords];

    //now only checks each coordinate once
    while (queue.length > 0) {
      let currCoords = queue.pop();
      console.log(currCoords);
      let currTile = copyGrid[currCoords[0]][currCoords[1]];
      // something's wrong here...
      if (!currTile.isFlagged && !visited[currCoords]) {
        visited[currCoords] = true;
        if (!currTile.isRevealed) {
          currTile.isRevealed = true;
          revealed--;
          
        }
        if (currTile.adjacentCount === 0) {
          //grab all possibile neighboring tiles
          let poss = this.generatePossibilities(currCoords[0], currCoords[1])
          poss.forEach(neighbor => {
            if (!visited[neighbor]) {
              queue.push(neighbor);
            }
          })
        }
      }
    }
    this.setState({
      grid: copyGrid,
      revealed
    }
      , () => this.winCheck())
  }

  handleFlagClick = (e, coords) => {
    if (!this.state.gameOver) {
      let mines = this.state.mines

      let copyGrid = [...this.state.grid];
      let currTile = copyGrid[coords[0]][coords[1]];

      currTile.isFlagged = !currTile.isFlagged
      currTile.isFlagged ? mines-- : mines++;

      this.setState({
        grid: copyGrid,
        mines
      }, () => this.winCheck()
      )
    }
   }

   winCheck = () => {
      if (this.state.mines === 0 && this.state.revealed === 0) {
        this.setState({ activeTimer: false, gameOver: true, won: true })
        return true
      }
      return false;
    }

  restartGame = (difficulty) => {
    this.setState({
      gameOver: false,
      activeTimer: true,
      won: false
    }, () => {
      this.determineBoard(difficulty)
    })
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
            let currTile = this.state.grid[i][j];
            return (
              <Square
                key={i + ":" + j}
                revealed={currTile.isRevealed}
                data={currTile.adjacentCount === 0 ? '' : currTile.adjacentCount}
                flagged={currTile.isFlagged}
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
