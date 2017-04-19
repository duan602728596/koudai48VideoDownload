/* gulp */
const gulp = require('gulp');
/* 编译器 */
const jade = require('gulp-pug'),       // jade(pug)
    sass = require('gulp-sass'),        // sass
    react = require('gulp-react');      // react
/* 格式化插件 */
const uglify = require('gulp-uglify'),    // 压缩js
    imagemin = require('gulp-imagemin'),  // 压缩图片
    utf8convert = require('gulp-utf8-convert'),                   // 文件转换成utf-8
    bom = require('gulp-bom'),                                    // 文件转换成有bom
    delGulpsassBlankLines = require('del-gulpsass-blank-lines'),  // 删除空行
    prettify = require('gulp-prettify');                          // 格式化html
/* 只传递更改过的文件 */
const changed = require('gulp-changed');
/* 错误处理 */
const plumber = require('gulp-plumber'),
    errorHandler = require('./errorHandler.js');
/* 生成映射文件 */
const sourcemaps = require('gulp-sourcemaps');
/* 当前文件位置 */
const dirname = __dirname;



/* 各个文件的位置 */
const file = {
    'src': {
        'html': `${ dirname }/src/html/**/*.html`,
        'jade': `${ dirname }/src/jade/**/*.jade`,
        'css':  `${ dirname }/src/css/**/*.css`,
        'sass': `${ dirname }/src/sass/**/*.sass`,
        'js': `${ dirname }/src/js/**/*.js`,
        'react': `${ dirname }/src/jsx/**/*.jsx`,
        'img': `${ dirname }/src/img/**/*.*`
    },
    'build': {
        'html': `${ dirname }/build/view`,
        'css': `${ dirname }/build/style`,
        'js': `${ dirname }/build/script`,
        'img': `${ dirname }/build/image`
    },
    'maps': {
        'css': `./`,
        'js': `./`
    }
};



/* html */
function _html(){
    return gulp.src(file.src.html)
        .pipe(changed(file.build.html, {
            extension: '.html'
        }))
        .pipe(gulp.dest(file.build.html));
}

/* jade */
function  _jade(){
    return gulp.src(file.src.jade)
        .pipe(changed(file.build.html, {
            extension: '.html'
        }))
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(prettify({
            indent_size: 4,
            unformatted: ['br', 'var']
        }))
        .pipe(delGulpsassBlankLines())
        .pipe(gulp.dest(file.build.html));
}

/* css */
function  _css(){
    return gulp.src(file.src.css)
        .pipe(changed(file.build.css, {
            extension: '.css'
        }))
        .pipe(utf8convert())
        .pipe(gulp.dest(file.build.css));
}

/* sass */
function _sass(){
    return gulp.src(file.src.sass)
        .pipe(changed(file.build.css, {
            extension: '.css'
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            outputStyle: 'compact' // compressed压缩
        }).on('error', sass.logError))
        .pipe(delGulpsassBlankLines())
        .pipe(utf8convert())
        .pipe(sourcemaps.write(file.maps.css))
        .pipe(gulp.dest(file.build.css));
}

/* js */
function _js(){
    return gulp.src(file.src.js)
        .pipe(changed(file.build.js, {
            extension: '.js'
        }))
        //.pipe(uglify())
        .pipe(utf8convert())
        .pipe(bom())
        .pipe(gulp.dest(file.build.js));
}

/* react */
function _react(){
    return gulp.src(file.src.react)
        .pipe(changed(file.build.js, {
            extension: '.js'
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(react())
        //.pipe(uglify())
        .pipe(utf8convert())
        .pipe(bom())
        .pipe(sourcemaps.write(file.maps.js))
        .pipe(gulp.dest(file.build.js));
}

/* 图片压缩 */
function _img(){
    return gulp.src(file.src.img)
        .pipe(changed(file.build.img))
        .pipe(imagemin())
        .pipe(gulp.dest(file.build.img));
}



/* 各种监视的文件流 */
function _watch(){
    gulp.watch(file.src.html, gulp.series(_img, _html));
    gulp.watch(file.src.jade, gulp.series(_img, _jade));
    gulp.watch(file.src.css, gulp.series(_img, _css));
    gulp.watch(file.src.sass, gulp.series(_img, _sass));
    gulp.watch(file.src.js, _js);
    gulp.watch(file.src.react, _react);
}


/* 初始化执行 */
gulp.task('default', gulp.series(
    gulp.parallel(_html, _jade, _css, _sass, _js, _react, _img),
    gulp.parallel(_watch)
));
