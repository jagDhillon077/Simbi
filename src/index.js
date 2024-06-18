import React from 'react';
import ReactDOM from 'react-dom';
import './react/index.css';
import App from './react/App';
import { createStore, compose, applyMiddleware } from 'redux'
import allReducers from './react/reducers/index'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { defaultState } from './react/types';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'user',
  storage: storage,
  whitelist: ['user'] // which reducer want to store
};

const pReducer = persistReducer(persistConfig, allReducers);

export const store = createStore(allReducers, defaultState, composeEnhancers(applyMiddleware(thunk,logger)));
const persistor = persistStore(store)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
