import { socket } from '../../../connection/socketio';
import { useEffect, useState } from 'react';
import { Chat } from './Chat';
import { VideoChat } from './VideoChat';
import '../css/GameRoom.css';

export const GameRoom = (props) => {

    const { userName, roomName } = props;

    // todo 
    const [opponent, setOpponent] = useState('');
    const [players, setPlayers] = useState([]);

    useEffect(() => {

        socket.on('both-connected', (users) => {
            setPlayers(users);
            const opp = users.filter(user => user.id !== socket.id)
            setOpponent(opp[0].userName);
            socket.emit('request-username', { roomName, userName });
        });

        return () => socket.off('both-connected');

    });

    useEffect(() => {

        socket.on('give-username', (name) => {
            setOpponent(name);
            console.log('heheh set name to ' + name)
        });

        return () => socket.off('give-username');

    });

    return (

        <div className="container">

            <VideoChat className='top'/>

            <div className='bottom'>

                <div className='gameContainer'>

                    {opponent && <span>Opponent: {opponent}</span>}
                    <div className='game'></div>

                </div>

                <Chat
                    userName={userName}
                    roomName={roomName}
                />

            </div>

        </div>

    );

}