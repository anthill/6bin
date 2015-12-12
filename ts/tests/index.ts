/// <reference path="../../typings/tsd.d.ts" />

'use strict';

import tryConnectTo from '../tools/tryConnectTo';
import { spawn } from 'child_process';

import { PORT } from '../server/PORT';

var apiConnectP = tryConnectTo('http://server:' + PORT);

apiConnectP
.then(() => {
    console.log('Running tests');

    var mochaTests = spawn('mocha', ['--recursive', 'tests/mocha/'], {stdio: 'inherit'});

    mochaTests.on('exit', process.exit);
});
