// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

export default {
  // input: 'main.js',
  // output: {
  //   file: 'bundle.js',
  //   format: 'iife'
  // },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main'],
      browser: true
    }),

    commonjs({
      include: 'node_modules/**',  // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false
      sourceMap: true,  // Default: true
    }),

    globals(),
    builtins()
  ]
};
