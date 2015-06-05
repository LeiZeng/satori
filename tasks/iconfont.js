import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import gulp from 'gulp'
import gutil from 'gulp-util'
import rename from 'gulp-rename'
import svg2ttf from 'gulp-svg2ttf'
import ttf2eot from 'gulp-ttf2eot'
import ttf2woff from 'gulp-ttf2woff'
import svgicons2svgfont from 'gulp-svgicons2svgfont'
import syncProcessor from 'gulp-sync-processor'
import gulpSvgIgnore from 'gulp-svg-ignore'
import watcher from './libs/watcher'
import md5 from 'MD5'
import mapStream from 'map-stream'

const taskName = path.basename(__filename, path.extname(__filename));

const defaultConfig = {
  src: [
    'components/icon/svgs/*.svg'
  ],
  dest: 'public/assets/fonts',
  destIconVars: 'src/utils/styles',
  destIcons: 'components/icon/styles',
  options: {
    "fontName": "iconfont",
    "normalize": true,
    "fixedWidth": true,
    "fontHeight": 576,
    "descent": 576 / 12 * 2,
    "centerHorizontally": true,
    "fontShortName": "icon",
    "bem": true
  }
};

module.exports = function (opts) {

  var conf = _.merge({}, defaultConfig, opts);

  gulp.task(taskName, function () {

    var tplData = {
      fontConfig: conf.options
    };

    function bundle() {
      return gulp.src(conf.src)
        .pipe(gulpSvgIgnore(['#gridlines', '#grids']))
        .pipe(svgicons2svgfont(conf.options))
        .on('codepoints', function (codepoints) {
          tplData.codepoints = codepoints.map(function (obj) {
            obj.codepoint = obj.codepoint.toString(16);
            return obj;
          });
        })
        .pipe(mapStream(function (file, callback) {
          tplData.fontConfig.hash = md5(String(file.contents));
          callback(null, file);
        }))
        .pipe(svg2ttf())
        .pipe(ttf2eot({clone: true}))
        .pipe(ttf2woff({clone: true}))
        .pipe(syncProcessor({
          options: {
            data: tplData,
            isProcess: function (data) {
              return data.codepoints.length > 0
            }
          },
          files: [
            {src: path.join(__dirname, 'tpls/icons.auto.jsx.ejs')},
            {src: path.join(__dirname, 'tpls/global-icons.auto.styl.ejs')},
            {src: path.join(__dirname, 'tpls/util-icons.auto.styl.ejs')}
          ]
        }))
        .pipe(rename(function (pathObj) {
          switch (pathObj.extname) {
            case '.styl':
              switch (pathObj.basename) {
                case 'global-icons.auto':
                  pathObj.dirname = conf.destIconVars;
                  break;
                case 'util-icons.auto':
                  pathObj.dirname = conf.destIcons;
                  break;
              }
              pathObj.basename = 'icons.auto';
              break;
            case'.jsx':
              pathObj.dirname = conf.destIcons;
              pathObj.basename = 'icons.auto';
              break;
            default:
              pathObj.dirname = conf.dest;
          }
        }))
        .pipe(gulp.dest(process.cwd()))
        .pipe(watcher.pipeTimer(taskName))
    }

    if (watcher.isWatching()) {
      gulp.watch([].concat(conf.src), (evt)=> {
        gutil.log(evt.path, evt.type);
        bundle();
      });
    }

    return bundle();

  })
};
