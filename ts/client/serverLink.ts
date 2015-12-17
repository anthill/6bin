'use strict';

import * as io from 'socket.io-client';

import { Map } from 'immutable';
import { Action } from './actions'; // Pending actions

import { PORT } from '../server/PORT';

export interface Request {
    index: number;
    action: Action;
}

var socket = io('http://localhost:' + PORT);

var counter: number = 0;
var promiseMap: any = Map();

socket.on('response', (response: any) => {
    var myPromise = promiseMap.get(response.index);

    console.log('index', response, response.index);
    console.log('myPromise', myPromise);

    if (response.isSuccessful)
        myPromise.resolve(response.data);
    else
        myPromise.reject(response.error);
});

export function sendToServer(action: Action) {

    counter ++;
    var resolve: any, reject: any;

    var p = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;

        socket.emit('request', {
            index: counter,
            action
        });
    });

    promiseMap = promiseMap.set(counter, {
        p,
        resolve,
        reject
    });

    // console.log('PROMISE', promiseMap.get(counter));

    return p;
}
