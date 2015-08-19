var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src([
        "ces.js",
        "services/map.js",
        "services/graphics.js",
        "services/easing.js",
        "services/image-loader.js",
        "systems/input-system.js",
        "systems/player-system.js",
        "systems/canvas-renderer.js",
        "systems/particle-system.js",
        "systems/char-builder.js",
        "systems/physics.js",
        "main.js"
    ])
    .pipe(concat('game.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});
