var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

/*
todo:
1. add browserify support, cause I can handle compiling in back end, not in front end like require.js
2. hot refresh
3. test dist files in hbuilder app project
4. add first level pages
5. fix pull down refresh event
6. if time is still enough, try vue
*/

gulp.task('clean-css', function () {
    return gulp.src(['./dist/css', './src/stylesheets/css'], {read: false})
        .pipe($.clean());
});

gulp.task('clean-js', function () {
    return gulp.src('./dist/js', {read: false})
        .pipe($.clean());
});

gulp.task('clean-public', function () {
    return gulp.src('./dist/public', {read: false})
        .pipe($.clean());
});

//为什么我这边的node.js一运行sourcemap，无论是webpack还是gulp都会直接报错仆街……代码应该无误
gulp.task('compile-sass', ['clean-css'], function () {
    $.rubySass.clearCache();//清理缓存，当前版本的gulp-ruby-sass似乎不能在options设置noCache了
    return $.rubySass('./src/stylesheets/scss/**/*.scss')
        .on('error', $.rubySass.logError)
        //.pipe($.sourcemaps.write('maps', {
        //    includeContent: false,
        //    sourceRoot: 'source'
        //}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.cleanCss())//minify css, gulp-minify-css has renamed to gulp-clean-css
        .pipe(gulp.dest('./src/stylesheets/css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify-js', function () {
    return gulp.src('./src/scripts/**')
        .pipe($.uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('images', function () {
    return gulp.src('./src/images/**/*')
        // Pass in options to the task
        .pipe($.imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('./dist/images'));
});

//不作为依赖执行的话，会导致useref先于sass编译完成导致找不到文件的错误；是否存在优化改进空间？
gulp.task('minify-html', ['compile-sass', 'clean-public'], function () {
    return gulp.src(['./src/html/**/*.html', './src/index.html'], {base: './src/'})//没有base就全部会输出到./dist根目录下
        .pipe($.useref())
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./dist'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
            , directory: true
        }
    });
    gulp.watch("*.scss", ["compile-sass"]).on("change", reload);
    gulp.watch("*.js", ["minify-js"]).on("change", reload);
    gulp.watch("*.html", ["minify-html"]).on("change", reload);
});

gulp.task('default', ['minify-js', 'minify-html', 'images', 'browser-sync']);