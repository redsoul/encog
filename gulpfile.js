const gulp = require('gulp');
const jasmine = require('gulp-jasmine-phantom');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('test', function () {
    return gulp.src(
        [
            'index.js',
            'src/**/*.js',
            'tests/before.js',
            'tests/**/*.specs.js'
        ])
        .pipe(jasmine({
            includeStackTrace: true,
            port: 8081
        }));
});