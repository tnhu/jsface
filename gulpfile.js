/*global require*/

var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

gulp.task('copy', function() {
  return gulp.src([
      'jsface.js',
      'jsface.pointcut.js'
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('min', function() {
  return gulp.src([
      'jsface.js',
      'jsface.pointcut.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (callback) {
  del(['dist'], callback);
});

gulp.task('default', function(callback) {
  runSequence(['copy', 'min'], callback);
});

gulp.task('watch', function() {
  gulp.watch('./*.js', ['default']);
});
