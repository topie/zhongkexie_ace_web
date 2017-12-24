var outPath = "dist";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');
var filter = require('gulp-filter');
var revReplace = require('gulp-rev-replace');
var cssmin = require('gulp-minify-css');
var htmlminify = require("gulp-html-minify");

gulp.task("build:js", function () {
    // 改动过的js文件压缩 加md5 放到dist的js目录下面
    gulp.src(['src/js/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/js/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('rev/js'));

});

gulp.task("dev:js", function () {
    // 改动过的js文件压缩 加md5 放到dist的js目录下面
    gulp.src(['src/js/**/*.js'])
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/js/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('rev/js'));

});

gulp.task("build:css", function () {

    // css压缩处理
    gulp.src('src/css/*.css')
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest(outPath + "/css/"))
        .pipe(sourcemaps.init())
        .pipe(rev.manifest())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest("rev/css/"));
});


gulp.task("build:cdn", function () {
    // 部分文件直接复制
    gulp.src('src/cdn/**/*.*').pipe(gulp.dest(outPath + "/cdn/"));
    gulp.src('src/fonts/**/*.*').pipe(gulp.dest(outPath + "/fonts/"));

});

gulp.task('replace', function () {
    var manifest = gulp.src("rev/**/rev-manifest.json");
    return gulp.src("src/*.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(htmlminify())
        .pipe(gulp.dest("dist"));
});

gulp.task('clean', function () {
    return gulp.src([outPath, 'rev']).pipe(clean());
});

gulp.task('build', ['build:js', 'build:css', 'build:cdn'], function () {

});
gulp.task('dev', ['dev:js', 'build:css', 'build:cdn'], function () {

});

