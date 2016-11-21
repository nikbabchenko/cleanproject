var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob');
    slim = require("gulp-slim"),
    coffee = require("gulp-coffee"),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer');


var slimSources = ['development/slim/*.slim'];
var htmlSources = ['production/*.html'];
var sassSources = ['development/sass/application.sass' ];
// var coffeeSources = ['development/coffeescripts/*.coffee'];
var imageSources = ['development/images/*'];

gulp.task('slim', function(){
  gulp.src(slimSources)
    .pipe(slim({
      pretty: true
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest("production/"))
    .pipe(connect.reload())
});

gulp.task('html', function(){
  gulp.src(htmlSources)
    .on('error', gutil.log)
    .pipe(connect.reload())
});

gulp.task('sass', function () {
  gulp.src(sassSources)
    .pipe(sass({
    includePaths: [require('node-bourbon').includePaths, require('node-normalize-scss').includePaths]
    }))
     .on('error', gutil.log)
    .pipe(gulp.dest('production/css'))
    .pipe(connect.reload())
});

// gulp.task('coffee', function() {
//   gulp.src(coffeeSources)
//     .pipe(coffee({bare: true}).on('error', gutil.log))
//     .pipe(gulp.dest('production/js'))
// });

gulp.task('imagesMin', function () {
    return gulp.src(imageSources)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('production/images'))
        .pipe(connect.reload())
});

gulp.task('connect', function() {
  connect.server({
    root: 'production/',
    livereload: true
    });
  });

gulp.task('watch', function() {
  gulp.watch(htmlSources, ['html']);
  gulp.watch('development/sass/**', ['sass']);
  // gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(imageSources, ['imagesMin']);
});



gulp.task('default', ['watch', 'connect']);
