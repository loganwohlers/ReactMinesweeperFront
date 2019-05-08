import React from 'react'

class Score extends React.Component {
    render() {
        // let ordered = this.props.scores.sort((a, b) => b.score - a.score).reverse()

        let ordered = this.props.scores.sort((a, b) => a.score - b.score)




        return (
            <div className='score'>
                <h3>{this.props.difficulty.toUpperCase()}</h3>
                <table cellSpacing="0" id="scoreTable" onMouseEnter={this.startTimer} >
                    <tbody>
                        {ordered.map((score, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1 + '. '}</td>
                                    <td>{score.user.username}</td>
                                    <td>{score.score + " s"} </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Score

// <ol className='scoreList'>
//   {ordered.map((score, index) => {
//     return (
//       <li key={index}>
//         {index+1}. {score.user.username} - {score.score} s
//       </li>
//     )
//   })}
// </ol>
//     < ol className = 'scoreList' >

//                         return (
//     <li key={index}>
//         <span>{score.user.username}</span>
//         <span>{score.score} s</span>
//     </li>
// )
//                     })}
