var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src([
        "ces.js",
        "services/graphics.js",
        "services/easing.js",
        "services/image-loader.js",
        "services/input-system.js",
        "systems/player-system.js",
        "systems/canvas-renderer.js",
        "systems/particle-system.js",
        "systems/char-builder.js",
        "main.js"
    ])
    .pipe(concat('game.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});
