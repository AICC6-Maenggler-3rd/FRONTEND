import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from "./App";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Problems from './pages/problem/Problems';
import MapPage from './components/MapPage';

// const script = document.createElement('script');
// script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
// script.type = 'text/javascript';
// document.head.appendChild(script);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
