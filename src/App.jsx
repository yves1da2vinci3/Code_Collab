import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import CodeRoom from './pages/CodeRoom';
import HomeScreen from './pages/HomeScreen';
import  { Toaster } from 'react-hot-toast';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:3000');

const App = () => {
  return (
   <Router>
    <Routes>
    <Route path="/" element={<HomeScreen socket={socket}/>} />
   <Route path="/code" element={<CodeRoom socket={socket} />} />
    </Routes>
   <Toaster/>
   </Router>
    
  );
};

export default App;
