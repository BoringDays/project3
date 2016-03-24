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

//Ϊʲô����ߵ�node.jsһ����sourcemap��������webpack����gulp����ֱ�ӱ����ͽ֡�������Ӧ�����󣬲�֪���ڸ�λ�Ļ����ϻ᲻��Ҳ����
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
    return gulp.src('./src/**![public]/*.html')//������iscroll�Դ��Ƕ�demoҳ��
        .pipe($.useref())
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))//gulp���е��⣬�����滹��js��css�����û��gulp-if����ͻ����
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