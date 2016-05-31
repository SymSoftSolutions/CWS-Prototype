var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var config = require('./config');

gulp.task('default', ['browser-sync'], function () {
});

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
    ignore: 'frontend/'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});
