// Incluir os módulos

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    //Agrupa os arquivos para realizar o build
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    //Realiza otimização das imagens
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    //Deletar arquivos para reconstruir o build
    del = require('del'),
    //executa as tarefas em ordem para construção do build
    runSequence = require('run-sequence')


//Configurar o Sass
gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream())
})

// Configurar Browser Sync
gulp.task('browserSync', function () {
    const files = [
        './src/css/app.css',
        './src/js/**/*.js',
        './src/**/*.html'
    ];
    //subir o server do Browser Sync
    browserSync.init(files, {
        server: {
            baseDir: 'src'
        },
    })
})

//Realizar o Build do pacote
gulp.task('useref', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        // Minifica apenas se for um arquivo JavaScript
        .pipe(gulpIf('*.js', uglify()))
        // Minifica apenas se for um arquivo CSS
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
})

//Otimização de Imagens
gulp.task('images', function () {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        // .pipe(cache - Realiza o cache das imagens
        .pipe(cache(imagemin({
            // imagens entrelaçadas
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
})

//Copiar arquivos de fontAwesome para Dev
gulp.task('fontsApp', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
        .pipe(gulp.dest('src/fonts/fontawesome-free/webfonts/'))
})

//Copiar os arquivos de distribuição das dependencias
gulp.task('devDepsJs', () => {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
    ])
    .pipe(gulp.dest('src/vendor'))
})

//Copiar arquivos de fontAwesome para Dev
gulp.task('fontsDist', function () {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

//Deletar arquivos para reconstruir o build
gulp.task('clean:dist', function () {
    return del.sync('dist');
})

//Tarefa do Watch
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch("src/scss/**/*.scss", ['sass'])
})

//Executar tarefas de Desenvolvimento
gulp.task('default', function (callback) {
    runSequence(['sass', 'fontsApp', 'devDepsJs', 'browserSync', 'watch'],
        callback
    )
})

//Executar o Build
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fontsDist'],
        callback
    )
})