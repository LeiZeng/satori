import gulp from 'gulp'
import gutil from 'gulp-util'
import path from 'path'
import _ from 'lodash'
import jade from 'gulp-jade'

import watcher from './libs/watcher'

const defaultConfig = {
  'entry': [
    'src/{,**/}index.jade'
  ],
  'src': [
    'src/{,**/}*.jade'
  ],
  'dest': 'public',
  'options': {
    'pretty': true
  }
};

let conf;

setOptions(); // init

const TASK_NAME = 'jade';

const task = gulp.task(TASK_NAME, function () {

  function bundle() {
    return gulp.src(conf.entry)
      .pipe(jade(conf.options))
      .on('error', gutil.log.bind(gulp))
      .pipe(gulp.dest(conf.dest))
      .pipe(watcher.pipeTimer(TASK_NAME))
  }

  if (watcher.isWatching()) {
    console.log([].concat(conf.src));
    gulp.watch([].concat(conf.src), (evt)=> {
      gutil.log(evt.path, evt.type);
      bundle();
    });
  }

  return bundle();

});

task.setOptions = setOptions;

export default task;

function setOptions(opts) {
  conf = _.merge({}, defaultConfig, opts)
}
