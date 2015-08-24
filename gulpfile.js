var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    var combined = gulp.src([
            "ces.js",
            "services/map.js",
            "services/graphics.js",
            "services/easing.js",
            "services/image-loader.js",
            "services/tones.js",
            "systems/input-system.js",
            "systems/player-system.js",
            "systems/canvas-renderer.js",
            "systems/particle-system.js",
            "systems/char-builder.js",
            "systems/physics.js",
            "systems/tilemap-system.js",
            "main.js"
        ])
        .pipe(concat('game.js'))
        .pipe(uglify().on('error', console.error.bind(console)))
        .pipe(gulp.dest('build/'));
    
    return combined;
});
