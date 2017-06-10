var gulp = require("gulp"),
    sass = require("gulp-sass"),
    nodemon = require("gulp-nodemon"),
    browserSync = require( "browser-sync"),
    babel = require('gulp-babel');
 
gulp.task('babel', function() {
    return gulp.src('./js/main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./build/assets/'));
});

gulp.task("cssCompiler", function() {
  return gulp.src("./css/*.scss")
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest("./build/assets/"));
});


//for frontend template and css refresh
gulp.task( "browserSync", function() {
	browserSync.init(["./build/assets/*.css",  "./build/assets/*.js"], {
        proxy: "localhost:8080"
  	});	
});

gulp.task("watcher", function() {
    gulp.watch("./css/*.scss", ["cssCompiler"]);
    gulp.watch("./js/main.js", ["babel"]);
});


gulp.task("dev", [ "watcher", "browserSync", "cssCompiler", "babel"]);


