const gulp = require('gulp')
const concat = require('gulp-concat')
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')


gulp.task('stylus', function() {
    gulp.src('./src/main.styl')
        .pipe(stylus({
            'include css': true
        }))
        .pipe(autoprefixer({
            browsers: [
                //
                // Official browser support policy:
                // https://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
                //
                'Chrome >= 45',
                'Firefox ESR',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 9',
                'Safari >= 9',
                'Android >= 4.4',
                'Opera >= 30'
            ]
        }))
        .pipe(csso())
        .pipe(gulp.dest('./static/assets'))
})

gulp.task('default', ['stylus'], function() {
    gulp.watch("./src/**/*", function() {
        gulp.run('stylus')
    })
})