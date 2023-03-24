import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import CodeRoom from './pages/CodeRoom';
import HomeScreen from './pages/HomeScreen';
import toast, { Toaster } from 'react-hot-toast';
const App = () => {

  return (
   <Router>
    <Routes>
    <Route path="/" element={<HomeScreen/>} />
   <Route path="/code" element={<CodeRoom/>} />
    </Routes>
   <Toaster/>
   </Router>
    
  );
};

export default App;
