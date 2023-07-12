import { useEffect, useRef, useState } from 'react';
import '../css/ChatRoom.css';
import { socket } from '../connections/socketio';
import { useNavigate } from 'react-router-dom';

export const ChatRoom = (props) => {

    const { userName, roomName } = props;
    const navigate = useNavigate();


    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState('');
    const [opponent, setOpponent] = useState('');
    const [stream, setStream] = useState();

    const chatsRef = useRef(null);
    const userVid = useRef(null);
    const oppVid = useRef(null);

    const sendMessage = () => {
        if (chat !== '') {
            const message = chat
            socket.emit('send-message', { userName, roomName, message });
            setChat('');
        }
    }

    const handleEnter = (e) => {
        if (e.keyCode === 13) sendMessage();
    };

    const leaveRoom = () => {
        socket.emit('leave-room', { userName, roomName });
        navigate('/', { replace: true });
    };

    useEffect(() => {
    // Access the user's webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Attach the stream to the video element
        if (userVid.current && oppVid.current) {
          userVid.current.srcObject = stream;
          oppVid.current.srcObject = stream;
          setStream(stream)
        }
      })
      .catch((error) => {
        console.error('Failed to access webcam:', error);
      });
  }, []);

    useEffect(() => {

        socket.on('both-connected', (data) => {
            const opp = data[0].userName === userName ? data[1] : data[0];
            setOpponent(opp.userName)
            console.log(data)
        })

        return () => socket.off('both-connected');
    });

    useEffect(() => {

        socket.on('receive-message', (data) => {
            alert("DLFLJKDFJKLDFJKL")
            console.log(data)
            setChats((prev) => [...prev, data]);
        });

        return () => socket.off('receive-message');

    });

    useEffect(() => {

        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;

    }, [chats]);

    const chatType = (message) => {

        if (message.userName === userName) return 'userChat';
        if (message.userName === 'Bot') return 'botChat';
        if (message.userName !== 'userName') return 'oppChat';
    };

    return (

        <div className='container'>

            <div className='gameContainer'>

                <span>Opponent: {opponent}</span>
                <div className='game'></div>

            </div>

            <div className='chatContainer'>

                <div className='videoContainer'>

                    {<video 
                        className='video' 
                        ref={userVid}
                        playsInline
                        muted
                        autoPlay>

                    </video>}

                    {<video 
                        className='video' 
                        ref={oppVid}
                        playsInline
                        muted
                        autoPlay>

                    </video>}

                </div>
                
                <button>Call Opponent</button>
                <button>end Call</button>

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
                            onChange={(e) => setChat(e.target.value)}
                            onKeyDown={handleEnter}
                            value={chat}
                        />
                        <button 
                            className='submit' 
                            onClick={sendMessage}
                        >
                            {'>'}
                        </button>

                    </div>

                </div>

                <button onClick={leaveRoom}>Leave Room</button>

            </div>

        </div>

    );

}