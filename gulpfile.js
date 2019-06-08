const fs = require("fs");

const gulp = require("gulp");
const gulpBabel = require("gulp-babel");
const browserify = require("browserify");
const browserSync = require('browser-sync').create();

// const rollup = require("rollup");
// const rollupCommonjs = require("rollup-plugin-commonjs");
// const rollupNodeResolve = require("rollup-plugin-node-resolve");
// const rollupGlobals = require("rollup-plugin-node-globals");
// const rollupBuiltins = require("rollup-plugin-node-builtins");

exports.snippets = function snippets() {
  browserSync.init({
    server: {
      baseDir: "snippets/",
      // index: "index.html"
      directory: true
    },
    open: false,
    cors: true,
    middleware: [
      require("compression")()
    ]
  });
};

exports.devserver = function devserver() {
  browserSync.init({
    server: {
      baseDir: ".",
      index: "index.html"
    },
    open: false,
    cors: true,
    middleware: [
      require("compression")()
    ]
  });
}

exports.babel = function babel() {
  return (
    gulp.src("src/**/*.js")
      .pipe(gulpBabel({}))
      .pipe(gulp.dest("dist"))
  );
};

exports.watch = function watch(cb) {
  const watcher = gulp.watch(["src/**/*.js", "src/*js"], exports.build);

  watcher.on("change", function(path, stats) {
    console.log(`File ${path} was changed`);
  });

  watcher.on("add", function(path, stats) {
    console.log(`File ${path} was added`);
  });

  watcher.on("unlink", function(path, stats) {
    console.log(`File ${path} was removed`);
  });
};

exports.bundle = function bundle(cb) {
  const b = browserify({
    entries: "./dist/main.js",
    debug: true,
  });

  return b.bundle((err, out) => {
    if (err) {
      console.log(err);
      cb();
    } else {
      fs.writeFileSync("./dist/_app.js", out);
      browserSync.reload();
      cb();
    }
  });
};

// let rollupCache = {}
// exports.bundle = async function bundle() {
//   const bundle = await rollup.rollup({
//     cache: rollupCache,
//     input: "dist/main.js",
//     plugins: [
//       rollupNodeResolve({
//         mainFields: ['module', 'main'],
//         browser: true
//       }),
//       rollupCommonjs({
//         include: 'node_modules/**',  // Default: undefined
//         // if true then uses of `global` won't be dealt with by this plugin
//         ignoreGlobal: false,  // Default: false
//         sourceMap: false,  // Default: true
//       }),
//       rollupGlobals(),
//       rollupBuiltins()
//     ]
//   });
//   const {output} = await bundle.generate({
//     dir: "dist2/",
//     format: "system",
//     sourcemap: true
//   });
//   rollupCache = bundle.cache
//   for (const chunkOrAsset of output) {
//     if (chunkOrAsset.isAsset) {
//       console.log('Asset', chunkOrAsset.fileName);
//     } else {
//       console.log('Chunk', chunkOrAsset.fileName);
//       fs.writeFileSync(`dist2/${chunkOrAsset.fileName}`, chunkOrAsset.code);
//       if (chunkOrAsset.map) {
//         fs.writeFileSync(`dist2/${chunkOrAsset.fileName}.map`, chunkOrAsset.map);
//       }
//     }
//   }
// };

exports.build = gulp.series(exports.babel, exports.bundle);


exports.default = gulp.parallel(
  exports.build,
  exports.watch,
  exports.devserver
);

