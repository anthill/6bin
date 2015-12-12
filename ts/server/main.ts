/// <reference path="../../typings/tsd.d.ts" />

'use strict';

import * as path from 'path';
import * as util from 'util';
import * as http from 'http';
import { EventEmitter } from 'events';

import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as socketIO from 'socket.io';

import { Action, actionsToBeSent as authorizedActions } from '../client/actions';
import { Request } from '../client/serverLink';

import { PORT } from './PORT';

import { List, Map } from 'immutable';

var app = express();

app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', '..')));
app.use('/img', express.static(path.join(__dirname, '..', '..', 'img')));

export function BinServer(): void {
	EventEmitter.call(this);

	var server = http.createServer(app);
	var io = socketIO(server);

	io.on('connection', (socket: any) => {
		// This is just a bridge to make the data go from 6bin client to 6brain
		socket.on('request', (data: Request) => {

			switch(data.action.type){
				case 'UPDATE_BIN': // only when availability changes
					console.log(data.action.type, 'is valid, => 6brain');

					var bin = data.action.bin;

					var shortBin: any = {
						id: bin.id,
						p: bin.position,
						a: bin.isAvailable,
						t: bin.type
					};

					this.emit('measurementRequest', {
						date: new Date(Date.now()).toISOString(),
						value: shortBin,
						index: data.index,
						origin: '6bin'
					});
					break;

				case 'SET_BINS':
					console.log(data.action.type, 'is valid, => 6brain');

					// shortening bin info
					var shortBins: any[] = [];
					Map(data.action.bins).forEach((bin) => { // for some reason, action.bins is not a Immutable.Map anymore ...
						shortBins.push({
							id: bin.id,
							p: bin.position,
							a: bin.isAvailable,
							t: bin.type
						});
					});

					this.emit('setBinsRequest', {
						bins: shortBins,
						index: data.index,
						origin: '6bin'
					});
					break;

				case 'GET_BINS':
					console.log(data.action.type, 'is valid, => 6brain');
					this.emit('getBinsRequest', {
						index: data.index,
						origin: '6bin'
					});
					break;


				default:
					console.log(data.action.type, 'is not valid');

			}

		});

		function transferToClient(response: any) {
			console.log('transfering from main.ts');
			socket.emit('response', response);
		}

		socket.on('disconnect', () => {
			this.removeListener('6bin', transferToClient);
		});

		this.on('6bin', transferToClient);
	});

	this.start = function(){
		server.listen(PORT, function () {
		    console.log('Server running on', [
		        'http://localhost:',
		        PORT
		    ].join(''));
		});
	};

	this.stop = function(){
		server.close();
	};
}

process.on('uncaughtException', function(e: Error){
    console.error('uncaught', e, e.stack);
    process.exit();
});

util.inherits(BinServer, EventEmitter);
