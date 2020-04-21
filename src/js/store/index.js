import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createReducers from './create-reducers';
import createSagaMiddleware, { END } from 'redux-saga';
import sagaRunner from '../sagas';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['layout', 'favouriteContainer']
};

export default (initialState, isServer = false) => {
    const history = !isServer ? createBrowserHistory() : null;
    const sagaMiddleware = createSagaMiddleware();
    const persistedReducer = isServer ? createReducers() : persistReducer(persistConfig, createReducers());
    const middleware = [sagaMiddleware, history && routerMiddleware(history)].filter(Boolean);

    const composeEnhancers = composeWithDevTools({});

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware)
    );

    const store = createStore(persistedReducer, initialState, enhancer);
    const persistor = !isServer ? persistStore(store) : null;

    sagaRunner(sagaMiddleware);
    store.close = () => store.dispatch(END);

    return { store, persistor, history };
};