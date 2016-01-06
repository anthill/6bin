'use strict';

import * as React from 'react';
import { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Set, Map } from 'immutable';

import BinList from '../Dumb/BinList';
import WastePicker from '../Dumb/WastePicker';
import PositionPicker from '../Dumb/PositionPicker';
import Bin from '../Dumb/Bin';
import BinValidator from '../Dumb/BinValidator';
import { BinData } from '../Dumb/Bin';
import { State, Action } from '../../actions';
import { addBin, deleteBin, updateBin, selectBin } from '../../actions'; // Bin actions
import { openBinPanel, setBinAddMode } from '../../actions'; // Display actions

interface ReduxPropsMixin{
    dispatch: Dispatch
}

interface BinPanelProps extends ReduxPropsMixin{
    bins: Map<string, BinData>;
    display: Map<string, any>;
}

interface BinPanelState{
    modifiedBin: BinData;
}

class BinPanel extends React.Component<BinPanelProps, BinPanelState> {
    mixins = [PureRenderMixin]

    constructor(props : BinPanelProps){ // equivalent to getInitialState()
        super(props);
        this.state = { modifiedBin: undefined };
    }

    componentWillReceiveProps(nextProps: BinPanelProps){
        var selectedId: string = nextProps.display.get('selectedBin');
        var selectedBin: BinData = nextProps.bins.get(selectedId);

        this.setState({
            modifiedBin: selectedBin
        });
    }

    render() {
        
        const { dispatch, bins, display } = this.props;
        const state = this.state;

        var isBinPanelOpen: boolean = display.get('isBinPanelOpen');
        var isAddingBins: boolean = display.get('isAddingBins');
        var isEditingBins: boolean = display.get('isEditingBins');
        var selectedId: string = display.get('selectedBin');
        var reference: string = display.get('reference');
        var selectedBin: BinData = bins.get(selectedId);

        var binValidator = React.createElement(BinValidator, {
            reference,
            selectedBin: selectedBin,
            modifiedBin: state.modifiedBin,
            onCancelation: () => { // unselect bin, close BinPanel and disable AddMode
                dispatch(
                    selectBin(undefined));
                dispatch(
                    openBinPanel(false));
                if (isAddingBins) 
                    dispatch(
                        setBinAddMode(false));
            },
            onValidation: () => { // unselect bin, close BinPanel + ...
                dispatch(
                    selectBin(undefined));
                dispatch(
                    openBinPanel(false));

                var nextId: number = 1;
                var nonPositionedBin: BinData;
                var position = state.modifiedBin.position;
                var type = state.modifiedBin.type;

                bins.forEach((bin: BinData) => { 
                    if (bin.position === position) // check if the clicked position is already assigned
                        nonPositionedBin = bin;
                    if (bin.type === type) // check how many bin of same type are present in bins (say n), and create the new bin with the id type + n+1
                        nextId ++;
                });

                if (nonPositionedBin){ // is position is already assigned to a bin, unposition this bin 
                    var temp = Object.assign({}, nonPositionedBin, { position: undefined });
                    dispatch(
                        updateBin(nonPositionedBin.id, temp));
                }

                if (isAddingBins) { // ... disable AddMode and add bin
                    dispatch(
                        setBinAddMode(false));

                    var newBin: BinData = {
                        id: type + '_' + nextId,
                        isAvailable: true,
                        type,
                        position
                    };

                    dispatch(
                        addBin(newBin));
                }
                else { // ... remove bin and add bin => because we need to update the id if type has changed
                    var updatedBin = {
                        id: type + '_' + nextId,
                        isAvailable: selectedBin.isAvailable,
                        type,
                        position
                    };

                    console.log('VALIDATION', position, type);
                    dispatch(
                        deleteBin(selectedId));
                    dispatch(
                        addBin(updatedBin));
                }
            }
        });

        var deleteButton = selectedId ? 
            React.createElement('div', {
                id: 'delete-button',
                onClick: () => {
                    dispatch(
                        selectBin(undefined));
                    dispatch(
                        deleteBin(selectedId));
                    dispatch(
                        openBinPanel(false));
                }
            }, 'Supprimer la benne')
            : undefined ;

        // Create the list with all bin types
        var wastePicker = React.createElement(WastePicker, {
            reference,
            type: state.modifiedBin ? state.modifiedBin.type : undefined,
            onWasteSelection: (type: string) => {
                this.setState({
                    modifiedBin: Object.assign({}, state.modifiedBin, { type })
                });
            }
        });

        // Create the list with all positions
        var assigned = Set(bins.toList().map((bin: BinData) => {
            return bin.position;
        }));

        var positionPicker = React.createElement(PositionPicker, {
            visible: isBinPanelOpen && !isAddingBins,
            assigned: assigned,
            max: 20,
            selected: state.modifiedBin ? state.modifiedBin.position : undefined,
            onPositionSelection: (position: number) => {
                this.setState({
                    modifiedBin: Object.assign({}, state.modifiedBin, { position })
                });
            }
        });

        return React.createElement('div', {id: 'editor'}, 
            isAddingBins ? 'Ajouter une benne' : 'Modifier une benne',
            binValidator,
            wastePicker,
            positionPicker,
            deleteButton
        );
    }
};

// Select only the part of the global state that is needed
function select(state: State) {
    return {
        bins: state.bins,
        display: state.display
    };
}

// Connect the component to Redux => making it Smart
export default connect(select)(BinPanel);
