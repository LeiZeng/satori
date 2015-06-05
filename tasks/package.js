import gulp from 'gulp'
import tar from 'gulp-tar'
import gzip from 'gulp-gzip'
import path from 'path'

var taskName = path.basename(__filename, path.extname(__filename));

module.exports = function (opts) {

  gulp.task(taskName, function () {
    return gulp.src('public/{,**/}*')
      .pipe(tar('webapp.tar'))
      .pipe(gzip())
      .pipe(gulp.dest('./'));
  });

};
