import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from "./App";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Problems from './pages/problem/Problems';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
