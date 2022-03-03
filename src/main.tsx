import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

import Login from './views/Login';
import MainLayout from './views/MainLayout';
import Home from './views/MainLayout/Home';
import User from './views/MainLayout/User';
import Family from './views/MainLayout/Family';
import Chart from './views/MainLayout/Chart';

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="home" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="user" element={<User />} />
            <Route path="family" element={<Family />} />
            <Route path="chart" element={<Chart />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route index element={<Navigate to="/home" />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// eslint-disable-next-line import/prefer-default-export
export { updateSW };
