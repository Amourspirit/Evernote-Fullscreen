import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import pkg from "./package.json";

export default {
  input: __dirname + `/lib/${pkg._name}.user.js`,
  output: {
    file: __dirname + `/scratch/rolled/${pkg._name}.user.js`,
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    // banner: 'document.addEventListener("DOMContentLoaded", function(event) { ',
    // footer: '});',
    name: 'userscript',
    sourcemap: false,
   /*  globals: {
      jquery: '$'
    } */
  },
 /*  external: [
    'jquery'
  ], */
  treeshake: true,
  // external: ['$'],
  plugins: [
    /* multiEntry({ exports: false }), */
    resolve({
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }), // tells Rollup how to find date-fns in node_modules
    // production && uglify() // minify, but only in production
    commonJS({ // converts date-fns to ES modules
      sourceMap: false,
      include: 'node_modules/**',
      // exclude: [__dirname + `/lib/modules/**`],  // Default: undefined
      ignoreGlobal: false,
     /*  namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        './lib/modules/class_settings.js': ['AppSettings']
      } */
    })
  ]
  // sourceMap: 'inline',
};
