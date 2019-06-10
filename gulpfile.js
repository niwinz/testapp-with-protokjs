const fs = require("fs");

const gulp = require("gulp");
const gulpBabel = require("gulp-babel");
const browserify = require("browserify");
const browserSync = require('browser-sync').create();

const rollup = require("rollup");
const rollupCommonjs = require("rollup-plugin-commonjs");
const rollupNodeResolve = require("rollup-plugin-node-resolve");
const rollupGlobals = require("rollup-plugin-node-globals");
const rollupBuiltins = require("rollup-plugin-node-builtins");
const rollupBabel = require("rollup-plugin-babel");

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

let rollupCache = {}
exports.bundle = async function bundle() {
  const bundle = await rollup.rollup({
    cache: rollupCache,
    input: {
      sample1: "src/sample1/main.js",
    },
    manualChunks: {
      "common": ["rxjs", "rxjs/operators", "react", "react-dom"]
    },
    plugins: [
      rollupBabel({
        exclude: 'node_modules/**',
        sourceMap: true
      }),
      rollupNodeResolve({
        mainFields: ['module', 'main'],
        browser: true
      }),
      rollupCommonjs({
        include: 'node_modules/**',  // Default: undefined
        // if true then uses of `global` won't be dealt with by this plugin
        ignoreGlobal: false,  // Default: false
        sourceMap: true,  // Default: true
      }),
      rollupGlobals(),
      rollupBuiltins()
    ]
  });

  const outputOptions = {
    dir: "dist/",
    format: "system",
    sourcemap: true,
    indent: true,
    preferConst: true,
    noConflict: true,
    freeze: true,
  };

  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);

  rollupCache = bundle.cache
};

exports.build = gulp.series(exports.bundle);

exports.default = gulp.parallel(
  exports.build,
  exports.watch,
  exports.devserver
);

