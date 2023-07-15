import { useEffect, useRef, useState } from 'react';
import '../css/Chat.css';
import { socket } from '../../../connection/socketio';
import { useNavigate } from 'react-router-dom';

export const Chat = (props) => {

    const { userName, roomName } = props;
    const navigate = useNavigate();


    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState('');

    const chatsRef = useRef(null);

    const sendChat = () => {
        if (chat !== '') {
            const message = chat
            socket.emit('send-chat', { userName, roomName, message });
            setChat('');
        }
    }

    const handleEnter = (e) => {
        if (e.keyCode === 13) sendChat();
    };

    const leaveGame = () => {
        socket.emit('leave-game', { userName, roomName });
        navigate('/', { replace: true });
    };

    useEffect(() => {

        socket.on('get-chat', (data) => {
            console.log(data);
            setChats((prev) => [...prev, data]);
        });

        return () => socket.off('get-chat');

    });

    useEffect(() => {

        if (userName) {
            setChats((prev) => [...prev, {
                message: `${userName} has joined the chat`, 
                userName: 'Bot'
            }]);
        }
        
    }, [userName]);

    useEffect(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }, [chats]);

    const chatType = (message) => {
        if (message.userName === userName) return 'userChat';
        if (message.userName === 'Bot') return 'botChat';
        if (message.userName !== 'userName') return 'oppChat';
    };

    return (

        <div className='chatContainer'>

            <div className="chatBox">

                <div className='chats' ref={chatsRef}>

                    {chats.map((msg, i) => (

                        <div className="chat" id={chatType(msg)} key={i}>

                            {msg.userName === userName ? msg.message : msg.userName + ": " + msg.message}

                        </div>

                    ))}

                </div>

                <div className="sendChat">

                    <input
                        className="type"
                        placeholder='Message...'
                        onKeyDown={handleEnter}
                        onChange={(e) => setChat(e.target.value)}
                        value={chat}
                    />
                    <button 
                        className='submit'
                        onClick={sendChat}
                    >
                        {'>'}
                    </button>

                </div>

            </div>

            <button 
                onClick={leaveGame}
                className='leaveGame'
            >
                Leave Game
            </button>

        </div>

    );

}