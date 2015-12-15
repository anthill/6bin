'use strict';

import * as React from 'react';
import { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map, List } from 'immutable';

import BinList from '../Dumb/BinList';
import WastePicker from '../Dumb/WastePicker';
import { BinData, BinPartialData, BinProps } from '../Dumb/Bin';
import { State, Action } from '../../actions';
import { sendData } from '../../asyncActions'; // async Actions
import { setBins, updateBin } from '../../actions'; // Bin actions
import { storeTempBins, clearTempBins } from '../../actions'; // TempBin actions
import { setBinEditMode, openBinPanel, setBinAddMode, selectBin } from '../../actions'; // Display actions

interface ReduxPropsMixin{
    dispatch: Dispatch
}

interface BinManagerProps extends ReduxPropsMixin{
    bins: Map<string, BinProps>;
    reference: string;
    tempBins: Map<string, BinProps>;
    pending: Map<number, Action>;
    display: Map<string, any>;
}

interface BinManagerState{}

var nextPending = 0;

class BinManager extends React.Component<BinManagerProps, BinManagerState> {
    mixins = [PureRenderMixin]

    render() {
        
        const { dispatch, bins, tempBins, pending, display } = this.props;

        if (pending.size === 0)
            nextPending = 0; // reinitializing the pending actions counter

        var isEditingBins: boolean = display.get('isEditingBins');
        var isBinPanelOpen: boolean = display.get('isBinPanelOpen');
        var isAddingBins: boolean = display.get('isAddingBins');
        var isInit: boolean = display.get('isInit');
        var selectedId: string = display.get('selectedBin');
        var reference: string = display.get('reference');

        var orderedBins = bins.sort((a: BinData, b: BinData) => {
            // console.log('Test', a.position, b.position, a.position > b.position);
            if (a.position === undefined)
                return 1;
            else if (b.position === undefined)
                return -1;
            else 
                return a.position - b.position;
        });

        // Create the bin list
        var binList = React.createElement(BinList, {
            bins: orderedBins,
            reference,
            selectedId,
            isEditing: isEditingBins,
            isAdding: isAddingBins,
            isBinPanelOpen: isBinPanelOpen,
            onBinAvailabilityChange: (id: string, isAvailable: boolean) => { 
                if (!isEditingBins){
                    var updatedBin = Object.assign({}, bins.get(id), { isAvailable });
                    var action = updateBin(id, updatedBin);
                    
                    console.log('Pending action Number', pending.size);

                    dispatch(
                        sendData(action, nextPending));
                    nextPending ++;
                }        
            },
            onBinSelection: (id: string) => {
                console.log('Selected', id);
                dispatch(
                    selectBin(id));
                dispatch(
                    openBinPanel(true));
                if (isAddingBins) 
                    dispatch(
                        setBinAddMode(false));
            },
            onAddModeActivation: () => {
                if (isBinPanelOpen)
                    dispatch(
                        selectBin(undefined));
                dispatch(
                    openBinPanel(!isAddingBins));
                dispatch(
                    setBinAddMode(!isAddingBins));
            }
        });

        // Create the button to edit bins
        var editBinsButton = !isInit ?
            React.createElement('div', {
                    id: 'edit-bins-button',
                    className: isEditingBins ? 'editing' : '',
                    onClick: () => {
                        if(!isEditingBins) {
                            dispatch(
                                storeTempBins(bins));
                            dispatch(
                                setBinEditMode(true));
                        }
                        else {
                            // after actions will be dispatched after async action
                            var action = setBins(bins);

                            dispatch(
                                setBinEditMode(false));
                            dispatch(
                                selectBin(undefined));
                            dispatch(
                                clearTempBins());

                            dispatch(
                                sendData(action, nextPending));
                            nextPending ++;
                        }
                            
                        if (isBinPanelOpen)
                            dispatch(
                                openBinPanel(false));
                    }
                }, 
                isEditingBins ? 'Valider': 'Gérer'
            ): undefined;

        var cancelButton = isEditingBins ?
            React.createElement('div', {
                id: 'cancel-bins-button',
                onClick: () => {
                    dispatch(
                        setBins(tempBins));
                    dispatch(
                        clearTempBins());
                    dispatch(
                        setBinEditMode(false));
                    dispatch(
                        openBinPanel(false));
                    dispatch(
                        selectBin(undefined));
                } 
            }, 'Annuler')
            : undefined;

        var text = isEditingBins ?
            React.createElement('h2', {}, 'Edition')
            : undefined;

        return React.createElement('div', {
                id: 'bin-manager'
            },
            text,
            binList,
            React.createElement('div', {}, // maybe this could be in App component
                editBinsButton,
                cancelButton
            )
        );
    }
};

// Select only the part of the global state that is needed
function select(state: State) {
    return {
        bins: state.bins,
        tempBins: state.tempBins,
        pending: state.pending, // => maybe should be in another smart component
        display: state.display
    };
}

// Connect the component to Redux => making it Smart
export default connect(select)(BinManager);
