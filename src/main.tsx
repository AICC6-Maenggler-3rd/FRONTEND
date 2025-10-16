import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// App 렌더링: #root에 App 컴포넌트 연결
const appRoot = document.getElementById('root');
if (appRoot) {
  ReactDOM.createRoot(appRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
