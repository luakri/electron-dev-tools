import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { components, history, store } from '../components.js';
import styles from './component.less';

const Core = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="window">
          <components.MenuTab />
          <div className="window-content">
              <div className="content-wrapper"><AppRouter /></div>
          </div>
        </div>
      </ConnectedRouter>
    </Provider>
  );
}

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/ngrok" component={components.Ngrok} />
    </Switch>
  );
}

const Home = () => {
  return (
      <components.LocalTunnel />
  );
}

export default Core;
