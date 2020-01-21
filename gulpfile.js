var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');

var paths = {
    pages: ['src/*.html'],
    assets: ['src/icons/*.png'],
    src: 'src',
    dist: 'dist'
};

function copyHtml() {
    return gulp.src(paths.pages, { base: paths.src })    
        .pipe(gulp.dest(paths.dist));
}

gulp.task("copy-html", copyHtml);

gulp.task("copy-assets", function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest(paths.dist + "/icons"));
});

gulp.task('develop', function (done) {
    var stream = nodemon({
        legacyWatch:true,
        ext: '*.js',
        watch: [paths.dist],
        ignore: ["*.map"],
        done: done,        
        verbose: true
    });

    copyHtml();

    watch(paths.pages).on('change', () => {
        stream.emit('restart', 10)
    });

    stream
        .on('restart', function () {
            console.log('restarted!')
        })
        .on('crash', function () {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10)  // restart the server in 10 seconds
        })
})

gulp.task("default", gulp.series(
    gulp.parallel('copy-html'),
    gulp.parallel('copy-assets'),
    () => {
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.dist));
    })
);