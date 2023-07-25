import './Home.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SHA3 } from 'crypto-js'
import { socket } from '../../connection/socketio';
import { toast } from 'react-hot-toast';

export const Home = (props) => {

    const navigate = useNavigate();

    const { user, room } = props;
    const { userName, setUserName } = user;
    const { roomName, setRoomName } = room;

    const [errorMessage, setErrorMessage] = useState('');

    const handleRoomChange = (e) => {
        setRoomName(e.target.value);
    };

    const handleNameChange = (e) => {
        setUserName(e.target.value);
    };

    useEffect(() => {

        socket.on('room-not-found', () => {
            toast('Room not found');
        });

        socket.on('room-full', () => {
            toast('Room is already full');
        });

        socket.on('room-already-exists', () => {
            toast('Room already exists');
        });

        socket.on('joined', (data) => {
            const { userName, roomName } = data;
            console.log(`User ${userName} joined the room`);
            navigate(`/game/${SHA3(roomName)}`);
        });

        socket.on('user-left', (data) => {
            console.log(`User ${data.id} left the room`);
        });

        return () => {
            socket.off('game-created');
            socket.off('room-not-found');
            socket.off('room-full');
            socket.off('user-joined');
            socket.off('user-left');
            socket.off('room-already-exists');
        };

    }, [navigate, roomName]);

    const createGame = () => {

        if (userName && roomName) {
            socket.emit('create-game', { userName, roomName });

        } else {
            toast('Please enter a userName and room name');
        }
    };

    const joinGame = () => {

        if (userName && roomName) {
            socket.emit('join-game', { userName, roomName });

        } else {
            toast('Please enter a username and room ID');
        }
    };

    return (

        <div className="home">

            <div className='title'>Home</div>

            <input 
                type="text"
                placeholder='Username'
                value={userName}
                onChange={handleNameChange}
                className='input' 
            />

            <input 
                type="text"
                placeholder='Room Name'
                value={roomName}
                onChange={handleRoomChange}
                className='input' 
            />

            <button className='roomBtn' id='top' onClick={createGame}>
                Create
            </button>

            <button className='roomBtn' onClick={joinGame}>
                Join
            </button>

        </div>

    );

}