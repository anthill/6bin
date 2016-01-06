'use strict';

/*
    This gulpfile is an 'outer' gulpfile that manages starting docker containers and watching/rebuilding files for dev purposes
    
    
```bash
gulp dev # prepares the dev environment
```

*/

require('es6-shim');

var spawn = require('child_process').spawn;
var path = require('path'); 
var join = path.join;

var browserify = require('browserify');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');



function bundleShare(b, name) {
    return new Promise(function(resolve, reject){
        b.bundle()
        .pipe(source( join('.', name) ) )
        .pipe(gulp.dest('.'))
        .on('error', function (err) {
            console.error('bundleShare error', err.message);
            reject(err);
        })
        .on('end', function(){
            console.log('Browserify bundle generated');
            resolve();
        });
    });
}

function browserifyShare(){
    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true,
        debug: true
    });
    
    b.add( join('.', 'js', 'client', 'main.js') );

    return bundleShare(b, 'browserify-bundle.js');
}

function tscDev(){

    return gulp.src(join('.', 'ts', '**/*.ts'))
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: true,
            suppressImplicitAnyIndexErrors: true,
            target: 'ES5',
            module: 'commonjs'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(join('.', 'js')));
}

function tscProd(){ // doesn't generate sourcemaps

    return gulp.src(join('.', 'ts', '**/*.ts'))
        .pipe(ts({
            noImplicitAny: true,
            suppressImplicitAnyIndexErrors: true,
            target: 'ES5',
            module: 'commonjs'
        }))
        .pipe(gulp.dest(join('.', 'js')));
}

// Browserify bundle the client
gulp.task('browserify-client', function(){
    return browserifyShare();
});

// Typescript compile the client
gulp.task('tsc-dev', function(){
    return tscDev();
});

gulp.task('tsc-prod', function(){
    return tscProd();
});


// Watch client
gulp.task('watch', ['build-dev'], function() {
    console.log('Watching client');
    
    // When a .js updates, Browserify bundle the client
    var jsClientWatcher = gulp.watch('./js/client/**/*.js', ['browserify-client']);
    jsClientWatcher.on('change', function(event) {
        console.log('** JS Client ** File ' + path.relative(__dirname, event.path) + ' was ' + event.type);
    });

    // When a .ts updates, Typescript compile the client
    var tsWatcher = gulp.watch('./ts/**/*.ts', ['tsc-dev']);
    tsWatcher.on('change', function(event) {
        console.log('** TS ** File ' + path.relative(__dirname, event.path) + ' was ' + event.type);
    });
});


// Typescript compile and then browserify bundle the client
gulp.task('build-dev', ['tsc-dev'], function(){
    return browserifyShare();
});

gulp.task('build-prod', ['tsc-prod'], function(){
    return browserifyShare();
});


