'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var ch = require('chalk');
var del = require('del');

var path = {
  srcPath: 'js/src/*.js',
  pathToWatch: 'js/src/**/*.js',
  destPath: 'js/dist'
}

gulp.task('default', ['ES6', 'watch']);

gulp.task('watch', () => {
  gulp.watch(path.pathToWatch, ['ES6'], (e) => {
    console.log(`[${ch.blue(new Date().toTimeString().split(' ')[0])}] ${ch.yellow(e.path.match(/(\w+\.js)/g))} was edited! Rebuild JS file...`)
  })
})

gulp.task('ES6', () => {
  return gulp.src(path.srcPath)
    .pipe(require('gulp-include')())
    .pipe(babel())
    .pipe(gulp.dest(path.destPath))
});
