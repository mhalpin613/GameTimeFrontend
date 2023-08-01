import { useEffect, useState } from 'react';
import { socket } from '../../../connection/socketio';
import '../css/TicTacToe.css';
import { toast } from 'react-hot-toast';
import { VscDebugRestart } from 'react-icons/vsc';

export const TicTacToe = (props) => {

    const { userName, oppUserName, oppId } = props;

    const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
    const [turn, setTurn] = useState(null);
    const [goFirst, setGoFirst] = useState(null);
    const [winner, setWinner] = useState('');
    const [moves, setMoves] = useState(0);

    useEffect(() => {

        socket.on('both-connected', data => {
            socket.emit('start-game', { oppId, goFirst: true });
        });

        return () => socket.off('both-connected');
    });

    useEffect(() => {

        socket.on('started', goFirst => {
            setGoFirst(goFirst);
            setTurn(goFirst);
        });

        return () => socket.off('started');
    });

    useEffect(() => {

        socket.on('board-state', data => {
            console.log(data)
            setBoard(data);
            setMoves(moves + 1);
            setTurn(!turn);
        });

        return () => socket.off('board-state');

    });

    useEffect(() => {

        socket.emit('give-winner', { oppId, winner });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winner]);

    useEffect(() => {

        socket.on('winner', winner => setWinner(winner));

        return () => socket.off('winner');
    });

    useEffect(() => {

        socket.on('handle-restart', () => {
            console.log('restarted');
            setWinner('');
            setMoves(0);
            setBoard(['','','','','','','','','']);
            setTurn(goFirst);
        });

        return () => socket.off('handle-restart');
    });

    const move = (i) => () => {

        if (winner === '' && moves < 9) {

            if (board[i] !== '') {
                toast('spot taken!');
                return
            }

            if (!turn) {
                toast('not your turn!');
                return
            }

            board[i] = (goFirst ? 'X' : 'O');
            setTurn(!turn);
            setMoves(moves + 1);

            checkWin();

            // todo err
            socket.emit('update', { board, oppId });
        }

        else toast('game is over!');
    };

    const checkWin = () => {

        let wins = ['XXX', 'OOO'];

        let rows = [
            board[0] + board[1] + board[2],
            board[3] + board[4] + board[5],
            board[6] + board[7] + board[8],
            board[0] + board[3] + board[6],
            board[1] + board[4] + board[7],
            board[2] + board[5] + board[8],
            board[0] + board[4] + board[8],
            board[2] + board[4] + board[6]
        ]

        // set state not immediate
        for (let i = 0; i < rows.length; i++) {
            let x = goFirst ? userName : oppUserName;
            let o = goFirst ? oppUserName : userName;
            if (rows[i] === wins[0]) setWinner(x);
            if (rows[i] === wins[1]) setWinner(o);
        }

        console.log(winner)

    };

    const restart = () => {
        console.log('restarting')
        setWinner('');
        setMoves(0);
        setBoard(['','','','','','','','','']);
        setTurn(goFirst);
        socket.emit('restart', oppId);
    }

    const conclusion = () => {

        if (oppId.length > 0) {

            if (moves >= 9) return 'Game ended in tie'

            else {
                return winner !== '' ? `Winner: ${winner}` : 
                        `${turn ? userName : oppUserName} is up`;
            }
        }
    }

    return (

        <div className='tttContainer'>

            <div className='top'>

                <span> Opponent: {oppUserName}</span>
                <button onClick={restart} className='restart'>
                    <VscDebugRestart />
                </button>

            </div>

            <div className='tictactoe'>

                {board.map((square, i) => {
                    return <div key={i} className='square' onClick={move(i)}> 
                                <span>{square}</span> 
                           </div>
                })}

            </div>

            <div className='turn'>
                {conclusion()}
            </div>

        </div>

    );

}