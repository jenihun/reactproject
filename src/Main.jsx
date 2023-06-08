import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  const handlespace2 = () => {
    navigate('/');
  };
  
    return (
    <div>
      <p>mainpage</p>
      <button onClick={handlespace2}>누르던가</button>
    </div>
  );
};

export default Main;