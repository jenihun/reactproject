import React from 'react';
import { BrowserRouter, Routes,Route} from 'react-router-dom';
import FPS from './FPS';
import Main from './Main';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<FPS/>}/>
          <Route path="/Main" element={<Main/>} />
    </Routes>
    </BrowserRouter>
    
  );
};

export default App;