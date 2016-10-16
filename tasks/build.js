/**
 * Created by zeev on 2016/10/16 0016.
 */
var less = require('gulp-less'),
	through2 = require('through2'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	header = require('gulp-header'),
	cleanCss = require("gulp-clean-css"),
	clean = require('gulp-clean'),
	useref = require("gulp-useref"),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	pkg = require("../package.json"),
	time = new Date().getTime();


module.exports = function (gulp, config, banner) {
	gulp.task('build:clean', function () {
		return gulp.src(config.output, { read: false })
			.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
			.pipe(clean({ force: true }))
	});

	gulp.task('build:copy', ["build:clean"], function () {
		gulp.src(config.copy.hbs)
			.pipe(gulp.dest(config.output));
		gulp.src(config.copy.public)
			.pipe(gulp.dest(config.output));

		gulp.src(config.copy.essay)
			.pipe(gulp.dest(config.output));

		gulp.src(config.copy.admin.js)
			.pipe(gulp.dest(config.output));
		gulp.src(config.copy.admin.html)
			.pipe(gulp.dest(config.output));
		gulp.src(config.copy.admin.css)
			.pipe(cleanCss())
			.pipe(gulp.dest(config.output));
	});

	gulp.task('build', ["build:clean", "build:copy"], function () {
		gulp.start("build:admin");
		gulp.start("build:index");
		gulp.start("build:signin");
	});

	gulp.task('build:admin', build_function("admin"));
	gulp.task('build:index', build_function("index"));
	gulp.task('build:signin', build_function("signin"));

	function build_function(path) {
		return function () {
			return gulp.src('./core/views*/' + path + '.hbs')
				.pipe(through2.obj(function (file, enc, cb) {
					if (file.isNull()) {
						return cb(null, file);
					}
					var _file = file.contents.toString();
					_file = _file.replace(/pkg_version/g, time);
					file.contents = new Buffer(_file);
					return cb(null, file);
				}))
				.pipe(useref({
					searchPath   : "core", //-- 寻找文件的目录 --
					base         : null, //--  输出文件的目录
					noAssets     : false,//-- 是否只是处理 html文件 --
					noconcat     : false,//-- 是否不合并 --
					newLine      : null,//-- 每次合并的时候，在合并的地方加上 string --
					transformPath: function (filePath) {//-- 可以在查找文件前修改路径 --
						return filePath.replace('/bower_components', '/../bower_components');
					}
				}))
				.pipe(through2.obj(function (file, enc, cb) {
					return cb(null, file);
				}))
				.pipe(gulpif("*.js", uglify()))
				.pipe(gulpif("*.js", header(banner, { pkg: pkg })))
				.pipe(gulpif("*.css", cleanCss()))
				.pipe(gulp.dest(config.output));
		}
	}

}