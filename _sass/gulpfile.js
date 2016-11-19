var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith  = require('gulp.spritesmith');

gulp.task('sass', function() {
    gulp.src('dev/sass/main.sass')
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {
            cascade: true
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function() {
    gulp.src('dev/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('js-libs', function() {
	return gulp.src(['dev/js/libs/jquery-3.0.0.min.js', 'dev/js/libs/jquery-ui.min.js', 'dev/js/libs/lightslider.min.js'])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css-libs', function () {
    return gulp.src(['dev/css/libs/screen.css', 'dev/css/libs/jquery-ui.css', 'dev/css/libs/lightslider.css'])
        .pipe(concat('libs.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js-uglify', function() {
    gulp.src('dev/js/*.js')
        .pipe(uglify('app.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', ['build'], function() {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('img', function() {
    return gulp.src('dev/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('sprite', function() {
    var spriteData = gulp.src('dev/sprite/*.png').pipe(spritesmith({
        imgName: '../img/icons.png',
        cssName: '_sprite.sass'
    }));
    spriteData.css.pipe(gulp.dest('dev/sass'));
    spriteData.img.pipe(gulp.dest('dist/img'));
});

gulp.task('build-fonts', function () {
    gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', ['clean', 'html', 'img', 'build-fonts', 'sprite', 'sass', 'css-libs', 'js-libs', 'js-uglify']);

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('dev/sass/*.sass', ['sass']);
    gulp.watch('dev/*.html', ['html'], browserSync.reload);
    gulp.watch('dev/js/*.js', ['js-uglify'], browserSync.reload);
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('default', ['watch']);
