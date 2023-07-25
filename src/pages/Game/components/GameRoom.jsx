import { socket } from '../../../connection/socketio';
import { useEffect } from 'react';
import { Chat } from './Chat';
import { VideoChat } from './VideoChat';
import '../css/GameRoom.css';
import { TicTacToe } from '../games/TicTacToe';

export const GameRoom = (props) => {

    const { userName, roomName, oppUserName, setOppUserName, oppId } = props;

    useEffect(() => {

        socket.on('remove-opp', () => {
            setOppUserName('');
        });

        return () => socket.off('remove-opp');
    });

    return (

        <div className="container">

            <VideoChat className='top' oppUserName={oppUserName} oppId={oppId}/>

            <div className='bottom'>

                <div className='gameContainer'>

                    <div className='game'>

                        <TicTacToe 
                            oppUserName={oppUserName} 
                            oppId={oppId} 
                            roomName={roomName}
                            userName={userName}
                        />

                    </div>

                </div>

                <Chat
                    userName={userName}
                    roomName={roomName}
                />

            </div>

        </div>

    );

}