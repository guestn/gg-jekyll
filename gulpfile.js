const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const child = require('child_process');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

//const cssFiles = './css/**/*.?(s)css';
const cssFiles = './css/**/*.scss'


 gulp.task('css', () => {
   gulp.src('./css/main.scss')
     .pipe(plumber({
       errorHandler: reportError
     }))
     .pipe(sass())
     .pipe(concat('all.css'))
     .pipe(gulp.dest('assets'));
 });


gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});


const browserSync = require('browser-sync').create();

const siteRoot = '_site';

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
  gulp.watch(cssFiles, ['css'])
});


/*
gulp.task('watch', () => {
  gulp.watch(cssFiles, ['css']);
});
*/



gulp.task('default', ['css', 'jekyll', 'serve'])

function reportError(error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);

    console.log(error.toString());

    this.emit('end');
}
