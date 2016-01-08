'use strict';

import * as React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import * as SVGComponent from 'react-inlinesvg';

import { BinPartialData } from './Bin';
import makeMap from '../../../tools/makeMap';

import * as binDico from 'waste-categories';

console.log('binDico', binDico);

interface WastePickerProps{
    reference: string;
    type: string;
    onWasteSelection: (delta: BinPartialData) => void;
}

interface WastePickerState{}


export default class WastePicker extends React.Component<WastePickerProps, WastePickerState> {
    mixins = [PureRenderMixin]

    render() {
        var props = this.props;

        // create the binPicker buttons
        var bins: React.ReactElement<any>[] = [];
        
        if (props.reference){
            makeMap(binDico[props.reference], 'type').forEach((item: any) => {
                bins.push(React.createElement('li', {
                        key: item.type,
                        className: [
                            'bin',
                            props.type === undefined || props.type === item.type ? '' : 'current',
                        ].join(' '),
                        onClick: (event: any) => {
                            console.log('CLICK');
                            props.onWasteSelection(item.type);
                        }
                    },
                    React.createElement(SVGComponent, {src: item.path}),
                    React.createElement('div', {}, item.type.toLowerCase())
                ));
            });
        }
        
        return React.createElement('div', {
                ref: 'wastelist',
                id: 'wastelist',
            },
            'Type de déchets',
            React.createElement('ul', {className: 'bins'},
                bins
            )
        );
    }
};
