import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Navigate,
  Route,
  RouteProps,
  Routes,
} from 'react-router-dom';
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

type CustomRoute<T> = T & {
  children?: CustomRoute<T>;
};

const ROUTES: CustomRoute<RouteProps[]> = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'home',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'user',
            element: <User />,
          },
          {
            path: 'family',
            element: <Family />,
          },
          {
            path: 'chart',
            element: <Chart />,
          },
        ],
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        index: true,
        element: <Navigate to="/home" />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" />,
  },
];

const renderRoute = (list: CustomRoute<RouteProps[]>) =>
  list.map((item) => {
    const { path, element, index = false, children = [] } = item;
    return (
      <Route key={path} path={path} index={index} element={element}>
        {Array.isArray(children) && children.length && renderRoute(children)}
      </Route>
    );
  });

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>{renderRoute(ROUTES)}</Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// eslint-disable-next-line import/prefer-default-export
export { updateSW };
