import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { GameRoom } from './pages/Game/components/GameRoom';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from './connection/socketio'
import { Toaster } from 'react-hot-toast';

export const App = () => {

  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [oppUserName, setOppUserName] = useState('');
  const [oppId, setOppId] = useState('');

  const controlUser = { userName, setUserName };
  const controlRoom = { roomName, setRoomName };

  useEffect(() => {
    // todo need id
    socket.on('both-connected', users => {
      const opp = userName === users[0].userName ? users[1] : users[0];
      setOppId(opp.id);
      setOppUserName(opp.userName);
    });

    return () => socket.off('both-connected');

  });

  return (

    <Routes>

      <Route 
        exact path="/" 
        element={<Home user={controlUser} room={controlRoom} oppUserName={oppUserName} oppId={oppId}/>} />

      <Route 
        exact path="/game/:roomId" 
        element={<GameRoom 
                  userName={userName} 
                  oppUserName={oppUserName} 
                  setOppUserName={setOppUserName}
                  oppId={oppId}
                  roomName={roomName}
                />} 
      />

    </Routes>

  );

};
