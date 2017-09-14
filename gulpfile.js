var gulp = require('gulp');
//var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

var scripts = require('./scripts');
var styles = require('./styles');

var ghPages = require('gulp-gh-pages');

var devMode = false;

/*
gulp.task('sass' , function(){
  return gulp.src('app/scss/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
});
*/

/**
 * Push build to gh-pages
 */
 gulp.task('deploy', function() {
   return gulp.src('./dist/**/*')
     .pipe(ghPages());
 });

gulp.task('css' , function(){
  gulp.src(styles)
      .pipe(concat('main.css'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.reload({
        stream : true
      }));
});

gulp.task('js', function(){
  gulp.src(scripts)
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.reload({
        stream : true
      }))
});

gulp.task('html', function(){
  gulp.src('./src/templates/**/*.html')
      .pipe(gulp.dest('./dist/'))
      .pipe(browserSync.reload({
        stream : true
      }));
});

gulp.task('build',function(){
  gulp.start(['css','js','html']);
});

gulp.task('browser-sync',function(){
  browserSync.init(null,{
    open: false,
    server : {
      baseDir : 'dist'
    }
  });
});

gulp.task('start',function(){
  devMode = true;
  gulp.start(['build','browser-sync']);
  gulp.watch(['./src/css/**/*.css'],['css']);
  gulp.watch(['./src/js/**/*.js'],['js']);
  gulp.watch(['./src/templates/**/*.html'],['html']);
});
