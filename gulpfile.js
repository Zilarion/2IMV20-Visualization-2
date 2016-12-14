'use strict';

var browserify = require('browserify');
var bulkSass = require('gulp-sass-bulk-import');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gulp = require('gulp');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps');

// Remove all build files
gulp.task('clean', function () {
    return gulp.src('www/*/**', {read: false})
        .pipe(clean());
});

// Compile js
gulp.task("js", function () {
    return browserify('src/js/app.js').bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('www/'));
});

// Compile sass
gulp.task('sass', function() {
    return gulp.src('src/scss/index.scss')
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('sourcemaps/'))
        .pipe(gulp.dest('www/'))
});

// Copy html
gulp.task('html', ['js', 'sass'], function() {
    return gulp.src('src/**/*.html')
        .pipe(inject(gulp.src(['www/**/*.js', 'www/**/*.css'], {read: false}), {ignorePath: 'www'}))
        .pipe(gulp.dest('www/'))
});

gulp.task('build', ['js', 'sass', 'html'], function() {});

gulp.task('default', ['clean', 'build'], function() {});
