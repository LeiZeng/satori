import gulp from 'gulp'
import path from 'path'
import R from 'ramda'
import reactDoc from './libs/react-doc'
import syncProcessor from 'gulp-sync-processor'
import watcher from './libs/watcher'

const taskName = path.basename(__filename, path.extname(__filename));

const defaultConfig = {
  'src': [
    'components/{,**/}*.jsx'
  ],
  'dest': 'src/docs/data'
};

export default (opts) => {

  var conf = R.merge(defaultConfig, opts);

  gulp.task(taskName, function () {

    var cache = {};

    function bundle() {
      return gulp.src(conf.src)
        .pipe(reactDoc('docs.auto.json'))
        .on('data', function (file) {
          var info = JSON.parse(String(file.contents));

          cache.requires = R.pipe(
            R.values,
            R.reduce(function (info, item) {

              if (R.prop('exampleRequires', item)) {
                info = R.merge(info, getInfoFromExampleRequires(R.prop('exampleRequires')(item)))
              }

              if (R.prop('property', item)) {
                R.pipe(
                  R.values,
                  R.forEach(function (obj) {
                    if (R.prop('exampleRequires')(obj)) {
                      info = R.merge(info, getInfoFromExampleRequires(R.prop('exampleRequires', obj)))
                    }
                  })
                )(R.prop('property', item))
              }

              if (R.prop('parma')(item)) {
                R.pipe(
                  R.values,
                  R.forEach(function (obj) {
                    if (R.prop('exampleRequires')(obj)) {
                      info = R.merge(info, getInfoFromExampleRequires(R.prop('exampleRequires', obj)))
                    }
                  })
                )(R.prop('parma')(item))
              }

              return info

            }, {}),

            R.merge(info)
          )(info);

          function getInfoFromExampleRequires(exampleRequires) {
            return R.reduce(function (info, item) {
              info[item.filePath] = item;
              return info
            }, {})(exampleRequires)
          }

        })
        .pipe(syncProcessor({
          options: {
            data: cache,
            isProcess: function (data) {
              return R.length(R.keys(data.requires))
            }
          },
          files: [
            {
              src: path.join(__dirname, 'tpls/docs.auto.jsx.ejs')
            }
          ]
        }))
        .pipe(gulp.dest(conf.dest))
        .pipe(watcher.pipeTimer(taskName));
    }

    if (watcher.isWatching()) {
      gulp.watch(conf.src, function (evt) {
        bundle();
      });
    }

    return bundle();

  });

};
