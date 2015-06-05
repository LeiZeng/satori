import gulp from 'gulp'
import connect from 'gulp-connect'
import path from 'path'
import url from 'url'
import config from 'config'
import nodemon from 'gulp-nodemon'

var taskName = path.basename(__filename, path.extname(__filename));

module.exports = function () {

  gulp.task(taskName, function () {

    nodemon({
      script: 'server/index.js',
      ext: 'js',
      execMap: {
        "js": "npm run babel-node"
      },
      watch: [
        'server/**',
        'config/**'
      ]
    })
      .on('restart', function () {
        console.log('restarted!')
      })

  });

};
