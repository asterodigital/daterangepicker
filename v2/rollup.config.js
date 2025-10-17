import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default [
  // Main JS bundle
  {
    input: 'src/daterangepicker.js',
    output: [
      {
        file: 'dist/daterangepicker.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'default'
      },
      {
        file: 'dist/daterangepicker.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/daterangepicker.umd.js',
        format: 'umd',
        name: 'DateRangePicker',
        sourcemap: true,
        globals: {
          dayjs: 'dayjs'
        }
      }
    ],
    external: ['dayjs'],
    plugins: [
      resolve(),
      commonjs(),
      production && terser()
    ]
  },
  // CSS bundle
  {
    input: 'src/daterangepicker.css',
    output: {
      file: 'dist/daterangepicker.css'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: production,
        sourceMap: true
      }),
      copy({
        targets: [
          { src: 'src/demo.html', dest: 'dist' }
        ]
      })
    ]
  }
];
