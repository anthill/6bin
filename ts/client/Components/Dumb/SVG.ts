'use strict';

import * as React from 'react';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';
import SVGInjector = require('svg-injector');
import PureRenderMixin from 'react-addons-pure-render-mixin';

function svgConfig (args: any): any {
    return {
        evalScripts: args.evalScripts || 'never',
        each: args.callback || null
    };
}

interface SVGProps{
    className: string;
    path: string;
    fallbackPath: string;
}
interface SVGState{
}

var svgDOM: any;

export default class SVGComponent extends React.Component<SVGProps, SVGState> {
    mixins = [PureRenderMixin]

    componentDidMount (){
        SVGInjector([this.refs.svg], svgConfig(this.props));
    }

    refs: {
        [key: string]: (React.Component<SVGProps, SVGState>);
        svg: (React.Component<SVGProps, SVGState>);
    }

    render () {

        return React.createElement(
            'img',
            {
                className: this.props.className,
                ref: 'svg',
                'data-src': this.props.path,
                'data-fallback': this.props.fallbackPath
            }
        );
    }
};
