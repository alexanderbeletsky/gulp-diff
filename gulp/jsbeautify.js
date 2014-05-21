'use strict';

var prettify = require('gulp-jsbeautifier');
var diff = require('..').diff;
var diffReporter = require('..').reporter;

module.exports = function(gulp, gwd, conf) {
  gulp.task('js-beautify', function() {
    var task = gulp.src([
        '!node_modules/**/*.js',
        '**/*.js'
      ])
      .pipe(prettify({
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE'
      }))
      .pipe(diff('.'))
      .pipe(diffReporter());
    if (conf.write) {
      // if task is run with `--write` then overwrite source files
      task.pipe(gulp.dest('.'));
    } else {
      task.on('data', function(data) {
        if (data.diff && Object.keys(data.diff).length) {
          // record that there have been errors
          gulp.fail = true;
        }
      });
    }
    return task;
  });
};