'use strict'

var gulp = require('gulp')
var minify = require('gulp-uglify')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var imagemin = require('gulp-imagemin')
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css')
var gulpSequence = require('gulp-sequence')


gulp.task('clean', function () {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean())
})

gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./dist/css'))
})


gulp.task('autoprefixer', () =>
    gulp.dest('./dist/css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./dist/css'))
)


gulp.task('minify', function () {
    return gulp.src('./src/js/**/*.js')
        // .pipe(minify().on('error', minify.logError))
        .pipe(minify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('./dist/js')) 
})



gulp.task('imagemin', function () {
    return gulp.src('./src/img/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest('./dist/img'))
})


gulp.task('fonts', function () {
    return gulp.src('./src/fonts/*').pipe(gulp.dest('./dist/fonts/'))
})




gulp.task('build', gulpSequence('clean', ['sass', 'autoprefixer', 'imagemin', 'fonts', 'minify']))

gulp.task('dev', function () {
    browserSync.init({
        server: "./"
    })
    gulp.watch('./src/scss/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('./src/js/*.js', ['minify']).on('change', browserSync.reload);
    gulp.watch('./index.html').on('change', browserSync.reload);
})

