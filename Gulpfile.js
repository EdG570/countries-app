var gulp = require('gulp'),
    connect = require('gulp-connect'),
    minify = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify');

gulp.task('connect', function() {
  connect.server({root:'build', livereload:true});
});

gulp.task('copy-html-files', function() {
  gulp.src('./app/*.html')
    .pipe(minify())
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-js-files', function() {
  gulp.src(['./app/js/cc-app.js', './app/bower_components/angular/angular.min.js', './app/bower_components/angular-animate/angular-animate.min.js', './app/bower_components/angular-route/angular-route.min.js'])
    .pipe(gulp.dest('build/js'));
});

gulp.task('minify-css', function() {
  return gulp.src(['./app/css/*.css', './app/bower_components/normalize-css/normalize.css'])
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css'));
});

gulp.task('minify-js', function() {
  return gulp.src('./app/js/cc-app.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy-images', function() {
  gulp.src('./app/img/*')
    .pipe(gulp.dest('build/img'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./app/*', ['copy-html-files', 'copy-js-files', 'minify-css', 'minify-js', 'copy-images', ]);
});


gulp.task('build', ['copy-html-files', 'copy-js-files', 'minify-css', 'minify-js', 'copy-images']);

gulp.task('default', ['connect']);

gulp.task('run', ['copy-html-files', 'copy-js-files', 'minify-css', 'minify-js', 'copy-images', 'connect', 'watch']);