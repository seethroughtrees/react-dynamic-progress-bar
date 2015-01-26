'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  to5 = require('gulp-6to5');

var handleError = function handleError(err) {
  var args = Array.prototype.slice.call(arguments);

  $.notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  this.emit('end');
};

gulp.task('build', function() {
  return gulp.src('./src/react-dynamic-progress-bar.js')
    .pipe(to5({
      modules: 'umd'
    }))
    .on('error', handleError)
    .pipe($.rename('react-dynamic-progress-bar.js'))
    .pipe(gulp.dest('./'))
    .pipe($.uglify())
    .pipe($.rename('react-dynamic-progress-bar.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('test:js', function() {
  return gulp.src('__tests__')
    .pipe($.jest({
      scriptPreprocessor: "./preprocessor.js",
      unmockedModulePathPatterns: [
          "node_modules/react"
      ],
      testPathIgnorePatterns: [
        "node_modules",
        "spec/support"
      ],
      moduleFileExtensions: [
        "js",
        "json",
        "react"
      ]
    }))
    .on('error', handleError);
});

gulp.task('demo:css', function() {
  return gulp.src(['demo/css/screen.scss', 'demo/styles/main.scss'])
    .pipe($.sass({
        outputStyle: 'compressed'
      }))
    .on('error', handleError)
    .pipe(gulp.dest('./dist/css/'))
  });

gulp.task('demo:html', function() {
  return gulp.src('demo/**.html')
    .pipe($.minifyHtml())
    .pipe(gulp.dest('./dist/'));
  });

gulp.task('demo:js', function() {
  return gulp.src('demo/js/**.*')
    .pipe(to5({
      modules: 'umd'
    }))
    .on('error', handleError)
    .pipe(gulp.dest('./dist/js/'))
  });

gulp.task('demo', ['demo:html', 'demo:js', 'demo:css']);

gulp.task('watch', ['demo', 'build'], function() {
  gulp.watch(['./src/**.*'], ['build']);
  gulp.watch(['./demo/**'], ['demo']);
});

gulp.task('test', function() {
  gulp.watch('./react-dynamic-progress-bar.js', ['test:js']);
});
