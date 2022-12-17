import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let index = -1;
        let template = Array(3).fill(null).map(() => new Array(3).fill(null));

        const board = template.map((row) => {
            return (
                <div key={index} className="board-row">
                    {row.map(() => {
                        index++;

                        return (this.renderSquare(index));
                    })}
                </div>
            );
        });

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: {}
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAscending: true,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, (this.state.stepNumber + 1));
        const current = history[(history.length - 1)];
        const squares = current.squares.slice();
        const player = this.state.xIsNext ? 'X' : 'O';
        const row = Math.floor(i / 3);
        const col = i % 3;

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = player;

        this.setState({
            history: history.concat([{
                squares: squares,
                location: {
                    "player": player,
                    "row": row,
                    "col": col,
                },
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        let moveCount = current.squares.filter((item) => {
            return item;
        }).length;

        const moves = history.map((step, move) => {
            let description = move ?
                `Go to move #${move} (${step.location.player}: ${step.location.row}, ${step.location.col})` :
                'Go to game start';
            description = (move === history.length - 1) ? <b>{description}</b> : description;

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {description}
                    </button>
                </li>
            );
        });

        if (winner) {
            status = 'Winner: ' + winner;
        } else if (moveCount === current.squares.length) {
            status = 'Result is draw.';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);

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

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}