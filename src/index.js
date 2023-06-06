import React from 'react'; //React를 임포트한다.
import ReactDOM from 'react-dom/client'; //React의 DOM 관련 동작을 담당하는 ReactDOM객체를 import -> createRoot()메서드를 사용하기 위해 필요
import './index.css'; 
import App from './App'; //FPS 컴포넌트를 사용할 수 있도록 함
import reportWebVitals from './reportWebVitals'; //애플리케이션의 성능을 측정하고 보고하는데 사용

/*
createRoot메서드를 사용하여 root 엘리먼트를 렌더링할 루트 리액트 컴포넌트를 생성, 
이때, document.getElementId('root')를 통해 HTML에서 root 엘리먼트를 선택합니다.
그리고 render를 호출하여 JSX를 렌더링한다.
*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); //함수 호출하여 애플리케이션 성능 측정
