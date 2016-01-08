'use strict';

import * as React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as SVGComponent from 'react-inlinesvg';
import { OrderedSet } from 'immutable';

import range from '../../../tools/range';

interface PositionPickerProps{
    visible: boolean;
    assigned: Set<number>;
    max: number;
    selected: number;
    onPositionSelection: (position: number) => void;
}

interface PositionPickerState{}

export default class PositionPicker extends React.Component<PositionPickerProps, PositionPickerState> {
    mixins = [PureRenderMixin]

    render() {
        var props = this.props;
        var allPositions = OrderedSet(range(1, props.max));

        // create the positionPicker buttons
        var positions = allPositions.map((position: number) => {

            return React.createElement('li', {
                    key: position, 
                    className: [
                        props.assigned.has(position) ? 'assigned' : '',
                        props.selected === position ? 'selected': ''
                    ].join(' '),
                    onClick: () => {
                        props.onPositionSelection(position);
                    }
                },
                position
            );
        }).toList();
        
        return React.createElement('div', {
                className: [
                    'positions',
                    props.visible ? 'visible' : ''
                ].join(' ')
            },
            'Numéro de benne',
            React.createElement('ul', {},
                positions.toList()
            )
        );
    }
};
