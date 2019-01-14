import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
  }
  
class Board extends React.Component {
    renderSquare(i) {
         return <Square 
            value = {this.props.squares[i]}
            onClick = {() => this.props.onClick(i)}
        />;
    }

    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}

class Game extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            xIsNext: true,
            step: 0,
            winner: null
        };
    }

    hadleClick(i) {
        let history = this.state.history.slice(0, this.state.step + 1),
            current = history[history.length -1],
            squares = current.squares.slice(),
            winner = null;

        if (squares[i] || this.state.winner) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        if (calculateWinner(squares)) {
            winner = this.state.xIsNext ? 'X' : 'O';
        }

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: this.state.step % 2,
            step: history.length,
            winner: winner
        });
    }

    jumpTo(move) {
            let current = this.state.history[move],
            squares = current.squares,
            winner = null;

        if (calculateWinner(squares)) {
            winner = this.state.xIsNext ? 'X' : 'O';
        }

        this.setState({
            step: move,
            xIsNext: move % 2 === 0,
            winner: winner
        });
    }

    render() {
        let history = this.state.history,
            current = history[this.state.step],
            squares = current.squares;

        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
        });

        let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        if (this.state.winner) {
          status = 'Winner: ' + this.state.winner;
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares = {squares}
                    onClick = {(i) => this.hadleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
         );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    // for (let i = 0; i < lines.length; i++) {
    //   const [a, b, c] = lines[i];
    //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //     return squares[a];
    //   }
    // }

    return lines.some((line) => (line.every((i) => squares[i] === 'X')) || (line.every((i) => squares[i] === 'O')));
}
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
