var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    babel = require('gulp-babel');

//defines default task and add the watch task to it
gulp.task('default', ['watch', 'connect', 'babelize', 'compress']);

//configure jshint task
gulp.task('jshint', function(){
  return gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function(){
  return gulp.src('source/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/assets/stylesheets'))
    .pipe(connect.reload());
});

gulp.task('babelize', function(){
  return gulp.src('source/javascript/babel.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('source/javascript/export'));
    compress();
});


gulp.task('connect', function() {
  connect.server({
    livereload: true
  })
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('source/javascript/export/*.js'),
        uglify(),
        gulp.dest('public/assets/javascript')
    ],
    cb
  );
});

//configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/javascript/export/*.js', ['jshint']);
  gulp.watch('source/scss/**/*scss', ['build-css']);
  gulp.watch('source/javascript/babel.js', ['babelize']);
  gulp.watch('source/javascript/export/babel.js', ['compress']);
});
