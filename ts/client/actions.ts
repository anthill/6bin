'use strict';

import * as io from 'socket.io-client';
import { List, Map, Set } from 'immutable';
import { BinData, BinPartialData } from './Components/Dumb/Bin';
import { sendToServer } from './serverLink';

export interface Action {
    type: string;
    position?: number;
    waste?: string;
    bin?: BinData;
    bins?: Map<string, BinData>;
    reference?: string;
    error?: string;
    index?: number;
    id?: string;
    isAvailable?: boolean;
    isPending?: boolean;
    isEditingBins?: boolean;
    isAddingBins?: boolean;
    isBinPanelOpen?: boolean;
    isInit?: boolean;
    pendingAction?: Action;
}

export interface State {
    display: Map<string, any>;
    pending: Map<number, Action>;
    bins: Map<string, BinData>;
    tempBins: Map<string, BinData>;
}

// Bin Actions
export const GET_BINS = 'GET_BINS'; // can be sent
export function getBins() {
    return { type: GET_BINS };
};

export const SET_BINS = 'SET_BINS'; // can be sent
export function setBins(bins: Map<string, BinData>) {
    return { type: SET_BINS, bins };
};

export const ADD_BIN = 'ADD_BIN';
export function addBin(bin: BinData) {
    return { type: ADD_BIN, bin};
};

export const UPDATE_BIN = 'UPDATE_BIN'; // can be sent
export function updateBin(id: string, bin: BinData) {
    return { type: UPDATE_BIN, id, bin };
};

export const DELETE_BIN = 'DELETE_BIN';
export function deleteBin(id: string) {
    return { type: DELETE_BIN, id };
};

export const actionsToBeSent = Set([UPDATE_BIN, SET_BINS, GET_BINS]);

// Temp Bins
export const STORE_TEMP_BINS = 'STORE_TEMP_BINS';
export function storeTempBins(bins: Map<string, BinData>) {
    return { type: STORE_TEMP_BINS, bins };
};

export const CLEAR_TEMP_BINS = 'CLEAR_TEMP_BINS';
export function clearTempBins() {
    return { type: CLEAR_TEMP_BINS };
};

// Display Actions
export const SELECT_BIN = 'SELECT_BIN';
export function selectBin(id: string) {
    return { type: SELECT_BIN, id };
};

export const SET_BIN_EDIT_MODE = 'SET_BIN_EDIT_MODE';
export function setBinEditMode(isEditingBins: boolean) {
    return { type: SET_BIN_EDIT_MODE, isEditingBins};
};

export const SET_BIN_ADD_MODE = 'SET_BIN_ADD_MODE';
export function setBinAddMode(isAddingBins: boolean) {
    return { type: SET_BIN_ADD_MODE, isAddingBins};
};

export const OPEN_BIN_PANEL = 'OPEN_BIN_PANEL';
export function openBinPanel(isBinPanelOpen: boolean) {
    return { type: OPEN_BIN_PANEL, isBinPanelOpen};
};

export const SET_ERROR_MODE = 'SET_ERROR_MODE';
export function setErrorMode(error: string | boolean) {
    return { type: SET_ERROR_MODE, error};
};

export const SET_INIT_MODE = 'SET_INIT_MODE';
export function setInitMode(isInit: boolean) {
    return { type: SET_INIT_MODE, isInit};
};

export const SET_WASTE_REFERENCE = 'SET_WASTE_REFERENCE';
export function setWasteReference(reference: string) {
    return { type: SET_WASTE_REFERENCE, reference };
};


// Pending Actions
export const ADD_PENDING_ACTION = 'ADD_PENDING_ACTION';
export function addPendingAction(index: number, pendingAction: Action) {
    return { type: ADD_PENDING_ACTION, index, pendingAction };
};

export const DELETE_PENDING_ACTION = 'DELETE_PENDING_ACTION';
export function deletePendingAction(index: number) {
    return { type: DELETE_PENDING_ACTION, index };
};

