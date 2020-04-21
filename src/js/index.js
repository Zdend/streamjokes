import { register, unregister } from './register-sw';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import createStore from './store';

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const { store, persistor, history } = createStore(preloadedState, false);

ReactDOM.hydrate(<App {...{store, persistor, history}} />, document.getElementById('root'));

if (process.env.NODE_ENV === 'production') {
    register();
} else {
    unregister();
}