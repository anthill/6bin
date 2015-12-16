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

    // drag(event: any, startTop: any, initY: number){
    //     event.preventDefault();

    //     return (e: any) => {
    //         var touches = e.changedTouches;
    //         var y = touches[0].clientY; // the touch position
    //         var dY = y - initY; // the delta induced by touch movement

    //         var element = this.refs.wastelist;
    //         var height = parseInt(element.style.height) || 0;
    //         // var top = parseInt(element.style.top) || 0;
    //         // if (dY > height)
    //             element.style.setProperty('top', startTop + dY);

    //         console.log('Move', dY);
    //         console.log('startLeft', startTop);
    //     };
    // }

    // componentDidMount() {
    //     var element = this.refs.wastelist;

    //     var drag: Function; // this is to keep the reference to be able to remove the listener

    //     element.addEventListener('touchstart', (event: any) => {
    //         console.log('events added', event.currentTarget);
    //         event.preventDefault();
            
    //         var initY = event.changedTouches[0].clientY; // the initial touch position
    //         var top = parseInt(element.style.getPropertyValue('top')) || 0; // initial left position
    //         drag = this.drag(event, top, initY);

    //         element.addEventListener('touchmove', drag);  
    //     });

    //     element.addEventListener('touchend', () => {
    //         console.log('removing listener');
    //         element.removeEventListener('touchmove', drag);
    //     });
    // }

    render() {
        var props = this.props;

        // create the binPicker buttons
        var bins: BinPartialData[] = [];
        
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
