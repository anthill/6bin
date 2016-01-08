/// <reference path="../../typings/tsd.d.ts" />

'use strict';

import * as React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { List, Map } from 'immutable';

import { getBinsFromServer } from './asyncActions';
import reducers from './reducers';
import { logger } from './middleware';
import Application from './Components/Smart/Application';
import { BinData } from './Components/Dumb/Bin';


var createStoreWithMiddleware = applyMiddleware(
	logger,
	<any>thunk // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/6231
)(createStore);
var store = createStoreWithMiddleware(reducers);

render(React.createElement(Provider, {store},
    React.createElement(
        Application, {retryTimeout: 10} // the Application component is just a wrapper of several smart components
    )), 
	document.getElementById('sixbin')
);

store.dispatch(getBinsFromServer(0));
