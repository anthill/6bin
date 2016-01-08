'use strict';

var Map = require('immutable').Map;
var BinServer = require('./js/server/main.js').BinServer;

var server = new BinServer(__dirname);

server.start(3000);

var initialBins = [
    {"id":"Cartons_1","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_2","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_3","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_4","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_5","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_6","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_7","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_8","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_9","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_10","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_11","p":15,"a":true,"t":"Cartons"},
    {"id":"Cartons_12","p":15,"a":true,"t":"Cartons"}
];
// var initialBins = [];

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
                owner: 'Agglo_Pau',
                bins: initialBins
            } // comment this to make the app crash on init
        });
    }, 1000);

    // setTimeout(function(){
    //     console.log('emitting');
    //     self.emit('6bin', {
    //         index: request.index,
    //         isSuccessful: false,
    //         error: 'An error occured'
    //     });
    // }, 10);
});
