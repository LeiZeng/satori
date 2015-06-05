import gulp from 'gulp';
import gutil from 'gulp-util';
import shell from 'gulp-shell';
import runSequence from 'run-sequence';

import watcher from './tasks/libs/watcher';
import jade from './tasks/jade'
import clean from './tasks/clean'
import browserify from './tasks/browserify'
import copy from './tasks/copy'
import stylus from './tasks/stylus'
import server from './tasks/server'
import mocha from './tasks/mocha'
// import checkCoverage from './tasks/check-coverage'
import build from './tasks/build'

build.setOptions({
  taskQueue: [
    'clean',
    'copy',
    'jade',
    'stylus',
    'browserify'
  ]
});

if (gutil.env.prod) {
  process.env.NODE_ENV = 'production';
}

if (gutil.env.dev) {
  process.env.NODE_ENV = 'development';
}

if (gutil.env.watch) {
  watcher.setWatcher();
}

gulp.task('dev', () => {
  watcher.setWatcher();
  runSequence('build', 'server');
});

gulp.task('default', ['build']);
