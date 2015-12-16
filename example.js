'use strict';

var Map = require('immutable').Map;
var BinServer = require('./js/server/main.js').BinServer;

var server = new BinServer();

server.start();

// var initialBins = [{"id":"Cartons_1","p":15,"a":true,"t":"Cartons"}];
var initialBins = [];

server.on('measurementRequest', function(request){
    var self = this;

    console.log('msg received', request);
    setTimeout(function(){
        console.log('emitting');
        self.emit('6bin', {
            index: request.index,
            isSuccessful: true
        });
    }, 1000);

});

server.on('setBinsRequest', function(request){
    var self = this;

    console.log('msg received', request);
    setTimeout(function(){
        console.log('emitting');
        self.emit('6bin', {
            index: request.index,
            isSuccessful: true,
            bins: request.bins
        });
    }, 1000);
});

server.on('getBinsRequest', function(request){
    var self = this;

    console.log('msg received', request);
    setTimeout(function(){
        console.log('emitting');
        self.emit('6bin', {
            index: request.index,
            isSuccessful: true,
            data: {
                owner: 'USTOM',
                bins: initialBins
            } // comment this to make the app crash on init
        });
    }, 2000);
});
