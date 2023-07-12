import '../css/Home.css'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA3 } from 'crypto-js'
import { socket } from '../connections/socketio';

export const Home = (props) => {

    const navigate = useNavigate();

    const { user, room } = props;
    const { userName, setUserName } = user;
    const { roomName, setRoomName } = room;

    const handleRoomChange = (e) => {
        setRoomName(e.target.value);
    };

    const handleNameChange = (e) => {
        setUserName(e.target.value);
    };

    const joinRoom = () => {

        if (roomName !== '' && userName !== '') {
            
            socket.emit('join-room', { userName, roomName });

            // todo do not redirect when this is emmited
            socket.once('room-full', () => {
                alert('Oh no! That room is full :/');
            });

            navigate(`game/${SHA3(roomName)}`, { replace: true });

        } else alert("Username and Room Name must be filled out.");
    }

    const handleEnter = (e) => {
        if (e.keyCode === 13) joinRoom();
    }

    return (

        <div className="home">

            <div className='title'>Home</div>

            <input 
                type="text"
                placeholder='Username'
                value={userName}
                onChange={handleNameChange}
                onKeyDown={handleEnter}
                className='input' 
            />

            <input 
                type="text"
                placeholder='Room Name'
                value={roomName}
                onChange={handleRoomChange}
                onKeyDown={handleEnter}
                className='input' 
            />

            <button className='roomBtn' id='top' onClick={joinRoom}>
                Join
            </button>

            <button className='roomBtn'>
                Create Room
            </button>

        </div>

    );

}