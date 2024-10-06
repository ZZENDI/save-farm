import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App import
// import './index.css'; // CSS 파일이 있을 경우 import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
