/// <reference path="../../typings/tsd.d.ts" />

'use strict';
require('es6-shim');

import tryConnectTo from '../tools/tryConnectTo';
import { spawn } from 'child_process';

var apiConnectP = tryConnectTo('http://server:3000');

apiConnectP
.then(() => {
    console.log('Running tests');

    var mochaTests = spawn('mocha', ['--recursive', 'tests/mocha/'], {stdio: 'inherit'});

    mochaTests.on('exit', process.exit);
});
