'use strict';

import * as React from 'react';
import { ReactElement } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Map } from 'immutable';

import { getBinsFromServer } from '../../asyncActions';
import { State, Action } from '../../actions';
import BinManager from '../Smart/BinManager';
import BinPanel from '../Smart/BinPanel';

interface ReduxPropsMixin{
    dispatch: Dispatch
}

interface ApplicationProps extends ReduxPropsMixin{
    display: Map<string, any>;
    pending: Map<number, Action>;
    retryTimeout: number;
}

interface ApplicationState{
    secondsRemaining: number;
}

class Application extends React.Component<ApplicationProps, ApplicationState> {
    mixins = [PureRenderMixin]

    constructor(props: ApplicationProps) { // equivalent to getInitialState()
        super(props);
        this.state = { secondsRemaining: 0 };
    }

    setRetryTimeout() {

        this.setState({
            secondsRemaining: this.props.retryTimeout
        }); 

        const countdown = setInterval(() => {
            
            this.setState({
                secondsRemaining: this.state.secondsRemaining - 1
            });
            console.log('Timeout', this.state.secondsRemaining);
            if (this.state.secondsRemaining === 0)
                clearInterval(countdown);
        }, 1000);        
    }

    render() {

        const { dispatch, pending, display } = this.props;
        const { secondsRemaining } = this.state;

        let isBinPanelOpen: boolean = display.get('isBinPanelOpen');
        var isAddingBin: boolean = display.get('isAddingBin');
        var isEditingBins: boolean = display.get('isEditingBins');
        var error: string = display.get('error');


        // Create the info text
        var infos: ReactElement<any>;

        if (pending.size > 0){
            var pendingActions = pending.toList().toJS().map((action: Action, key: number) => {
                return React.createElement('div', {key}, action.type);
            });

            infos = React.createElement('div', {id: 'infos'},
                'En cours de transfert:',
                pendingActions
            );
        }

        var manager: ReactElement<any>;
        var panel: ReactElement<any>;
        var footer: ReactElement<any>;
        var errorMsg: ReactElement<any>;
        var refreshButton: ReactElement<any>;

        if (!error){
            manager = React.createElement('div', {id: 'manager', className: isEditingBins ? 'edit' : ''},
                React.createElement(BinManager)
            );

            panel = React.createElement(BinPanel);

            footer = React.createElement('div', {id: 'footer'},
                infos
            );
        }
        else {
            errorMsg = React.createElement('div', {id: 'error'},
                'Le capteur ne s\'est pas initialisé correctement'
            );

            refreshButton = React.createElement('div', {
                    id: 'refresh',
                    onClick: secondsRemaining === 0 ? () => {
                        this.setRetryTimeout()
                        dispatch(getBinsFromServer(0));           
                    } : undefined
                },
                secondsRemaining > 0 ? 'Patientez ' + secondsRemaining  : 'Réessayer' 
            );
        }
            

        return React.createElement('div', {
                id: 'app',
                className: [
                    isEditingBins ? 'edit' : '',
                    isBinPanelOpen ? 'panel-open' : ''
                ].join(' ')
            },
            manager,
            panel,
            footer,
            errorMsg,
            refreshButton
        );
    }
};

// Select only the part of the global state that is needed
function select(state: State) {
    return {
        display: state.display,
        pending: state.pending
    };
}

// Connect the component to Redux => making it Smart
export default connect(select)(Application);