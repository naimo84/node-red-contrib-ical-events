const gulp = require("gulp");
const ts = require("gulp-typescript");

const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const watch = require('gulp-watch');

const paths = {
    pages: ['src/nodes/*.html'],
    src: 'src',
    dist: 'dist'
};

function copyHtml() {
    gulp.src('src/resources/*.html', { base: 'src/resources' })
        .pipe(gulp.dest('resources'));

    return gulp.src('src/nodes/*.html', { base: 'src/nodes' })
        .pipe(gulp.dest(paths.dist));
}

gulp.task("copy-html", copyHtml);

gulp.task('develop', function (done) {
    const stream = nodemon({
        legacyWatch: true,
        exec: 'node --inspect=9229 --preserve-symlinks      --experimental-modules       --trace-warnings     /usr/lib/node_modules/node-red/red.js',
        ext: '*.js',
        watch: [paths.dist],
        ignore: ["*.map"],
        done: done,
        verbose: true,
        delay: 2000,
        env: { "NO_UPDATE_NOTIFIER": "1" }
    });

    copyHtml();
    const tsProject = ts.createProject("tsconfig.json");
    const tsProjectresources = ts.createProject("tsconfig-resources.json");

    tsProjectresources.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectresources())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('resources'));

    tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist));

    watch(paths.pages).on('change', () => {
        copyHtml();
        stream.emit('restart', 10)
    });

    watch('src/**/*.ts').on('change', () => {

        tsProjectresources.src()
            .pipe(sourcemaps.init())
            .pipe(tsProjectresources())
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('resources'));

        tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.dist));

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
    () => {
        const tsProjectresources = ts.createProject("tsconfig-resources.json");
        tsProjectresources.src()
            .pipe(sourcemaps.init())
            .pipe(tsProjectresources())
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('resources'));

        const tsProject = ts.createProject("tsconfig.json");
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.dist));
    })
);