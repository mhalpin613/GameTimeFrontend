import { useEffect, useState } from 'react';
import { socket } from '../../../connection/socketio';
import '../css/TicTacToe.css';
import { toast } from 'react-hot-toast';
import { VscDebugRestart } from 'react-icons/vsc';

export const TicTacToe = (props) => {

    const { userName, roomName, oppUserName, oppId } = props;

    const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
    const [turn, setTurn] = useState(null);
    const [goFirst, setGoFirst] = useState(null);
    const [winner, setWinner] = useState('');
    const [moves, setMoves] = useState(0);
    const [tie, setTie] = useState(false);

    // todo restart, tie, win

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
            setBoard(data.board);
            setMoves(moves + 1);
            setTurn(!turn);
            setWinner(data.winner);

            if (moves === 8 && winner === '') setTie(true);
        });

        return () => socket.off('board-state');

    });

    useEffect(() => {

        if (tie) toast('tie');

    });

    useEffect(() => {

        socket.emit('update', { board, oppId, winner });

        return () => socket.off('update');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winner]);

    useEffect(() => {

        socket.on('handle-restart', () => {
            console.log('restarted')
            setTie(false);
            setWinner('');
            setMoves(0);
            setBoard(['','','','','','','','','']);
            goFirst ? setTurn(true) : setTurn(false);
        });

        return () => socket.off('handle-restart');
    });

    const move = (i) => () => {

        if (winner === '' || tie) {

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
            console.log(moves);

            checkWin();
            console.log(winner)

            socket.emit('update', { board, oppId, winner });

            if (moves === 9 && winner === '') setTie(true);
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
        setTie(false);
        setWinner('');
        setMoves(0);
        setBoard(['','','','','','','','','']);
        goFirst ? setTurn(true) : setTurn(false);
        socket.emit('restart', oppId);
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
                {oppId.length > 0 && (winner !== '' ? `Winner: ${winner}` : 
                        `${turn ? userName : oppUserName} is up`)}
            </div>

        </div>

    );

}