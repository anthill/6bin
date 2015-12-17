'use strict';

import { Map } from 'immutable';

import { BinData } from './Components/Dumb/Bin';

import makeMap from '../tools/makeMap';
import { sendToServer } from './serverLink';
import { getBins, setBins, setWasteReference, Action } from './actions'; // Bin actions
import { setErrorMode, setInitMode } from './actions'; // Display actions
import { addPendingAction, deletePendingAction } from './actions'; // Pending actions

export function sendData(action: Action, id: number, after?: Action[]) {

    return function (dispatch: any) {
        dispatch(
            addPendingAction(id, action));
        dispatch(action);

        sendToServer(action) // This sends the action to 6bin server, which will forward it to 6brain
        .then((data) => {
            // The async action has been correctly handled and has been returned to 6bin successfully
            console.log('YOUHOU !!!! Now you should dispatch the correct action');
            
            dispatch(
                deletePendingAction(id));

            // NEED TO UPDATE BINS WHEN NECESSARY
        })
        .catch((error) => {
            // There was an error handling the async action

            console.log('Its a SHAME !!!! You should still dispatch the correct action');
            // DO SOMETHING IF REJECTED
        });
    };
}

export function getBinsFromServer(id: number) {

    return function (dispatch: any){
        var action: Action = getBins();

        dispatch(
            addPendingAction(id, action));
        dispatch(
            setInitMode(true));
        dispatch(
            setErrorMode(false));

        var sendToServerP = sendToServer(action);
        var timeoutP = new Promise(function(resolve, reject){
            setTimeout(function(){
                reject('Timeout');
            }, 3000);
        });

        Promise.race([sendToServerP, timeoutP])
        .then((received: any) => {

            console.log('Bins received from server');
            var bins: BinData[] = [];

            received.bins.forEach((shortBin: any) => {
                bins.push({
                    id: shortBin.id,
                    position: shortBin.p,
                    isAvailable: shortBin.a,
                    type: shortBin.t
                });
            });

            var binMap = makeMap(bins, 'id');
            console.log('binMap', binMap);
            console.log('REFERENCE', received.owner);
            
            dispatch(
                setBins(Map<string, BinData>(binMap)));
            dispatch(
                setInitMode(false));
            dispatch(
                setWasteReference(received.owner))
            dispatch(
                deletePendingAction(id));

        })
        .catch((error) => {
            console.log('Couldnt get bins from server', error);

            dispatch(
                setErrorMode(error));
            dispatch(
                deletePendingAction(id));
        });

    }
}
