var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src([
        'ces.js',
        'services/input-system.js',
        'services/image-loader.js',
        'systems/player-system.js',
        'systems/canvas-renderer.js',
        'main.js'
    ])
    .pipe(concat('game.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});
