const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

// Paths to your files
const paths = {
  styles: {
    src: 'src/app/scss/**/*.scss',
    dest: 'dist/css/'
  },
  html: {
    src: '/*.html',
    dest: 'dist/'
  }
};

// Compile SCSS to CSS, then minify CSS
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError)) // Compile SCSS to CSS
    .pipe(cleanCSS()) // Minify the CSS
    .pipe(rename({ suffix: '.min' })) // Rename the output file
    .pipe(gulp.dest(paths.styles.dest)) // Output the CSS to destination folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

// Minify HTML
function minifyHTML() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true })) // Minify HTML
    .pipe(gulp.dest(paths.html.dest)) // Output the minified HTML to destination folder
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

// Serve and watch for file changes
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  // Watch for changes in SCSS and HTML files
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.html.src, minifyHTML).on('change', browserSync.reload);
}

// Define Gulp tasks
exports.styles = styles;
exports.minifyHTML = minifyHTML;
exports.serve = serve;

// Default Gulp task: compile styles, minify HTML, and serve with live-reloading
exports.default = gulp.series(gulp.parallel(styles, minifyHTML), serve);
