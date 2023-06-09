import React from 'react';
import { BrowserRouter, Routes,Route} from 'react-router-dom';
import FPS from './FPS';
import MainPrint from './mainPrint';
import Print from './practice'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<FPS/>}/>
          <Route path="/practice" element={<Print/>}/>
          <Route path="/mainPrint" element={<MainPrint/>}/>
    </Routes>
    </BrowserRouter>
    
  );
};

export default App;