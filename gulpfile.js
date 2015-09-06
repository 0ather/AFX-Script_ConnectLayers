var gulp   = require('gulp');
var path   = require('path');
var concat = require('gulp-concat');
var shell  = require('gulp-shell');
var del    = require('del');

var paths = {
  lib: ['./lib/*.js']
}


gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('build', ['clean'], function() {
  return gulp.src(paths.lib)
    .pipe(concat('connectLayers.jsx'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('run-script', ['build'], function() {
  return gulp.src('./build/connectLayers.jsx', {read: false})
    .pipe(shell([
      "sh '<%= extra_dir() + \"/extras/build.sh\" %>' '<%= build_filename() %>' 'connectLayers.jsx' && osascript '<%= extra_dir() + \"/extras/run.scpt\" %>' 'connectLayers.jsx'"
    ], {
      templateData: {
        build_filename: function() {
          return __dirname + "/build/connectLayers.jsx";
        },
        extra_dir: function() {
          return __dirname;
        }
      }
    }));
});

gulp.task('watch', function() {
  gulp.watch(paths.lib, ['run-script']);
});

gulp.task('default', ['build', 'watch']);
