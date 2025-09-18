import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from "./App";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Problems from './pages/problem/Problems';
import Login from './pages/Login';
import { UserInfo } from './pages/UserInfo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userinfo" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
