import gulp from 'gulp'
import gutil from 'gulp-util'
import mocha from 'gulp-mocha'
import _ from 'lodash'
import path from 'path'
import mergeSteam from 'merge-stream'
import istanbul from 'gulp-istanbul'
import babel from 'gulp-babel'
import watcher from './libs/watcher'
import './libs/jsdom'

const TASK_NAME = 'checkCoverage'

const defaultConfig = {
	'entry': [
		'src/services/__test__/*.spec.js'
	],
	'src': [
		'src/services/*.js'
	],
	'options': {
		'reporter': 'spec'
	}
};

const coverageReportPath = 'node_modules/coverageReport/'

let conf
setOptions()

const task = gulp.task(TASK_NAME, ()=> {
	function bundle() {
		process.env.NODE_ENV = process.env.NODE_ENV || 'test'

		return gulp.src(conf.src)
		.pipe(babel())
		.pipe(istanbul({
			includeUntested: true,
		}))
		.pipe(istanbul.hookRequire())
		.on('finish', ()=> {
			gulp.src(conf.entry)
			.pipe(mocha(conf.options))
			.pipe(istanbul.writeReports({
				dir: coverageReportPath,
				reporters: ['cobertura', 'text', 'text-summary'],
				reportOpts: {dir: coverageReportPath}
			}))
			.pipe(istanbul.enforceThresholds({thresholds: {global: 80}}))
			.once('error', function (err) {
				gutil.log(err.message);
				process.exit(1);
			})
			.on('end', ()=> {
				process.exit()
			})
		});
	}

	if (watcher.isWatching()) {
		gulp.watch([].concat(conf.src), function (evt) {
			gutil.log(evt.path, evt.type)
			bundle()
		});
	}

	return bundle()
})

task.setOptions = setOptions;

export default task

function setOptions(opts) {
	conf = _.merge({}, defaultConfig, opts)
}
