var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  del = require('del'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  reactify = require('reactify'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(cb) {
  del(['build/**/*'], cb)
});

gulp.task('html', function() {
    gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./src/js/main.js'],
    transform: [reactify], // Convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  var watcher  = watchify(bundler);

  return watcher
  .on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle() // Create new bundle that uses the cache for high performance
    .pipe(source('main.js'))
    // Add uglifying etc
    .pipe(gulp.dest('./build/'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('main.js'))
  .pipe(gulp.dest('./build/'));
});

gulp.task('css', function () {
  gulp.watch('src/styles/**/*.css', function () {
    return gulp.src('styles/**/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/'));
  });
});

gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'compressed', sourcemap: true })
    .on('error',function(err){ console.log(err.message); })
    .pipe(sourcemaps.write('.', {includeContent:false, sourceRoot:'./src/styles/'} ))
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('sass', function () {
  return sass('src/styles/main.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copy', function() {
   gulp.src('./bower_components/normalize.css/normalize.css')
   .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['build/**']).on('change', livereload.changed);
});


gulp.task('default', ['html', 'browserify', 'styles']);

gulp.task('dev', ['clean'], function() {
  gulp.start('copy', 'html', 'sass', 'browserify', 'watch');
});