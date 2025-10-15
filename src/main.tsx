import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Header } from './layouts/header';
import { Footer } from './layouts/footer';
import './index.css';

// 1. Header 렌더링: #header-root에 Header 컴포넌트 연결
const headerRoot = document.getElementById('header-root');
if (headerRoot) {
  ReactDOM.createRoot(headerRoot).render(
    <React.StrictMode>
      <Header />
    </React.StrictMode>,
  );
}

// 2. Content 렌더링: #root에 나머지 App 컴포넌트 연결
const appRoot = document.getElementById('root');
if (appRoot) {
  ReactDOM.createRoot(appRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// 3. Footer 렌더링: #footer-root에 Footer 컴포넌트 연결
const footerRoot = document.getElementById('footer-root');
if (footerRoot) {
  ReactDOM.createRoot(footerRoot).render(
    <React.StrictMode>
      <Footer />
    </React.StrictMode>,
  );
}
