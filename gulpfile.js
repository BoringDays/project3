var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('clean-css', function () {
    return gulp.src('dist/css', {read: false})
        .pipe($.clean());
});

gulp.task('clean-js', function () {
    return gulp.src('dist/js', {read: false})
        .pipe($.clean());
});

gulp.task('clean-public', function () {
    return gulp.src('dist/public', {read: false})
        .pipe($.clean());
});

//为什么我这边的node.js一运行sourcemap，无论是webpack还是gulp都会直接报错仆街……代码应该无误，不知道在各位的机器上会不会也这样
gulp.task('compile-sass', ['clean-css'], function () {
    return gulp.src('./src/stylesheets/main.scss')
        //.pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.cleanCss())//minify css, gulp-minify-css has renamed to gulp-clean-css
        //.pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('minify-js', ['clean-js'], function () {
    return gulp.src('./src/scripts/**')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function () {
    return gulp.src('./src/images/**/*')
        // Pass in options to the task
        .pipe($.imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('minify-html', ['clean-public'], function () {
    return gulp.src('./src/**![public]/*.html')//不编译iscroll自带那堆demo页面
        .pipe($.useref())
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))//gulp运行到这，流里面还有js和css，如果没有gulp-if处理就会出事
        .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
            //,directory: true
        }
    });
    gulp.watch("*.scss", ["compile-sass"]);
    gulp.watch("*.js", ["minify-js"]).on("change", reload);
    gulp.watch("*.html", ["minify-html"]);
});

gulp.task('default', ['compile-sass', 'minify-js', 'minify-html', 'images', 'browser-sync'])