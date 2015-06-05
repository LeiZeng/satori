import gulp from 'gulp'
import path from 'path'
import fs from 'fs'

import del from 'del'
import NwBuilder from 'node-webkit-builder'

var taskName = path.basename(__filename, path.extname(__filename));


var defaultConfig = {
  options: {
    files: './public/**/**',
    buildDir: './.tmp/build',
    cacheDir: './.tmp/cache',
    platforms: ['osx64', 'win32'],
    manifest: {
      name: 'BOC CC',
      version: '0.0.1',
      main: "index.html",
      window: {
        toolbar: false,
        width: 1000,
        height: 680,
        'min-width': 1000,
        'min-height': 680
      }
    }
  }
};


module.exports = function () {

  var conf = defaultConfig;

  gulp.task(taskName, function (cb) {

    var nw = new NwBuilder(conf.options);

    var pkg = conf.options.manifest;

    fs.writeFileSync('./public/package.json', JSON.stringify(pkg));

    nw.on('log', console.log);

    del([conf.options.buildDir], function () {
      nw.build().then(function () {
        cb();
      }).catch(function (error) {
        console.error(error);
      });
    });

  });

};
