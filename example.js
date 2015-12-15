'use strict';

var Map = require('immutable').Map;
var BinServer = require('./js/server/main.js').BinServer;

var server = new BinServer();

server.start();

// var initialBins = [
//     {"id":"BATTERIES_4","p":15,"a":true,"t":"BATTERIES"},{"id":"ECRANS_1","p":4,"a":true,"t":"ECRANS"},{"id":"ECRANS_2","p":9,"a":true,"t":"ECRANS"},{"id":"ECRANS_3","p":13,"a":true,"t":"ECRANS"},{"id":"CARTONS_1","p":1,"a":false,"t":"CARTONS"},{"id":"CARTONS_2","p":6,"a":true,"t":"CARTONS"},{"id":"BOIS_1","p":3,"a":true,"t":"BOIS"},{"id":"BOIS_2","p":8,"a":true,"t":"BOIS"},{"id":"BOIS_3","p":12,"a":true,"t":"BOIS"},{"id":"EXTINCTEURS_1","p":5,"a":true,"t":"EXTINCTEURS"},{"id":"CARTOUCHE_ENCRE_1","a":true,"t":"CARTOUCHE_ENCRE"},{"id":"EXTINCTEURS_2","p":10,"a":false,"t":"EXTINCTEURS"},{"id":"EXTINCTEURS_3","p":14,"a":true,"t":"EXTINCTEURS"},{"id":"BATTERIES_1","p":2,"a":true,"t":"BATTERIES"},{"id":"BATTERIES_2","p":7,"a":true,"t":"BATTERIES"},{"id":"BATTERIES_3","p":11,"a":true,"t":"BATTERIES"}];

var initialBins = [{"id":"Cartons_1","p":15,"a":true,"t":"Cartons"}];

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
                ref: 'USTOM',
                bins: initialBins
            } // comment this to make the app crash on init
        });
    }, 2000);
});
