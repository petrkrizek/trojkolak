import React from 'react'
import LeaderboardTeam from '../components/leaderboard/LeaderboardTeam'

export default class Leaderboard extends React.Component {
    render() {
        return (
            <div className="leaderboard">
                <h1 className="leaderboard__title">Game Over</h1>
                {this.props.leaderboard.map(team => {
                    return <LeaderboardTeam players={team.players} points={team.points} />
                })}

                    <div className="leaderboard__buttons">
            {this.props.leader && <button className="leaderboard__playagain" onClick={this.props.playAgain}>Play Again</button> }
                        <button className="leaderboard__exit" onClick={this.props.exitGame}>Exit</button>
                    </div>
            </div>
        )
    }
}