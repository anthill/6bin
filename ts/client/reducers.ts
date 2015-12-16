'use strict';

import { combineReducers } from 'redux';
import { List, Map } from 'immutable';

import { BinData } from './Components/Dumb/Bin';
import { Action } from './actions';
import { SET_BINS, ADD_BIN, UPDATE_BIN, DELETE_BIN } from './actions';
import { STORE_TEMP_BINS, CLEAR_TEMP_BINS } from './actions';
import { ADD_PENDING_ACTION, DELETE_PENDING_ACTION } from './actions';
import { SET_WASTE_REFERENCE, SET_BIN_EDIT_MODE, SET_BIN_ADD_MODE, OPEN_BIN_PANEL, SELECT_BIN, SET_ERROR_MODE, SET_INIT_MODE } from './actions';

// Bins is the state of all bins
var initialBinState = Map<string, BinData>({});
function bins (state = initialBinState, action: Action) {
    switch (action.type) {
        case SET_BINS:
            return action.bins;

        case ADD_BIN:
            return state.set(action.bin.id, action.bin);

        case UPDATE_BIN:
            return state.set(action.id, action.bin);

        case DELETE_BIN:
            return state.delete(action.id);

        default:
            return state;
    }
}

var initialTempBinState = Map<string, BinData>({});
function tempBins (state = initialTempBinState, action: Action) {
    switch (action.type) {
        case STORE_TEMP_BINS:
            return state.merge(state, action.bins);

        case CLEAR_TEMP_BINS:
            return Map({});
        
        default:
            return state;
    }
}

// Pending Actions are actions that need to be validated by the server
var initialPendingState = Map<number, Action>({});

function pending (state = initialPendingState, action: Action){
    switch (action.type) {
        case ADD_PENDING_ACTION:
            return state.set(action.index, action.pendingAction);

        case DELETE_PENDING_ACTION:
            return state.delete(action.index);

        default:
            return state;
    }
}

// Display is the state of what buttons/windows/texts is on the screen
interface DisplayState {
    isEditingBins: boolean;
    isAddingBins: boolean;
    isBinPanelOpen: boolean;
    selectedBin: string;
    error: string;
    isInit: boolean;
    reference: string;
}

var displayState: DisplayState = {
    isEditingBins: false,
    isAddingBins: false,
    isBinPanelOpen: false,
    selectedBin: undefined,
    error: undefined,
    isInit: true,
    reference: undefined
};

var initialDisplayState = Map(displayState);

function display (state = initialDisplayState, action: Action){
    switch (action.type) {
        case SET_BIN_EDIT_MODE:
            return state.set('isEditingBins', action.isEditingBins);

        case SET_BIN_ADD_MODE:
            return state.set('isAddingBins', action.isAddingBins);

        case OPEN_BIN_PANEL:
            return state.set('isBinPanelOpen', action.isBinPanelOpen);

        case SELECT_BIN:
            return state.set('selectedBin', action.id);

        case SET_ERROR_MODE:
            return state.set('error', action.error);

        case SET_INIT_MODE:
            return state.set('isInit', action.isInit);

        case SET_WASTE_REFERENCE:
            return state.set('reference', action.reference);

        default:
            return state;
    }
}

const binApp = combineReducers({
    bins,
    tempBins,
    pending,
    display
});

export default binApp;
