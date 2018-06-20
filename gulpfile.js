'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('test', function () {
    return gulp.src(
        [
            'index.js',
            'src/**/*.js',
            'tests/before.js',
            'tests/neural/training/propagation/sgd.specs.js'
            // 'tests/**/*.specs.js'
        ])
        .pipe(jasmine({
            includeStackTrace: true,
            port: 8081
        }));
});