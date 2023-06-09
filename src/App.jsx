import React from 'react';
import { BrowserRouter, Routes,Route} from 'react-router-dom';
import FPS from './FPS';
import mainPageRender from './mainPage';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<FPS/>}/>
          <Route path="main2" element={<main2/>}/>
          <Route path="mainPage" element={<mainPageRender/>}/>
    </Routes>
    </BrowserRouter>
    
  );
};

export default App;