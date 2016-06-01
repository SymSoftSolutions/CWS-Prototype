var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');

var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var config = require('./config');


var backendTests = 'test/*.unit.test.js';
var frontendTests = 'test/*.e2e.test.js';

gulp.task('default', ['browser-sync']);
gulp.task('test', ['test-backend', 'watch-backend']);

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:" + config.server.port,
    files: ["views/**/*.*"],
    browser: "google chrome",
    port: 7000,
  });
});

gulp.task('nodemon', function (cb) {
  var started = false;

  return nodemon({
    script: 'server.js',
    ignore: ['frontend/', backendTests, 'node_modules/**/*.js']
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});


gulp.task('test-backend', function(){
  gulp.src(backendTests)
      .pipe(mocha({
        reporter: 'spec',
        istanbul: false,
      }));
});


var backendFiles = ['middleware/**/*.js',  'server.js', 'lib/**/*.js', backendTests, 'models/**/*.js'];

// Watch Files For Changes
gulp.task('watch-backend',  function() {
  gulp.watch(backendFiles, ['test-backend']);
});
