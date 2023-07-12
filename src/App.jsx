import './css/App.css'
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { ChatRoom } from './components/ChatRoom';
import { useState } from 'react';

export const App = () => {

  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');

  const controlUser = { userName, setUserName };
  const controlRoom = { roomName, setRoomName };

  return (

    <Routes>

      <Route 
        exact path="/" 
        element={<Home user={controlUser} room={controlRoom}/>} />

      <Route 
        exact path="/game/:roomId" 
        element={<ChatRoom userName={userName} roomName={roomName}/>} />

    </Routes>

  );

};
