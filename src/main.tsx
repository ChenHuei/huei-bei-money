import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import Layout from './views/Layout';
import './index.css';

import Login from './views/Login';
import Home from './views/Layout/Home';
import User from './views/Layout/User';

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="home" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="user" element={<User />} />
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
