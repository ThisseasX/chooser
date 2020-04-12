import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import externalGlobals from 'rollup-plugin-external-globals';
import cleaner from 'rollup-plugin-cleaner';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  plugins: [
    typescript(),
    terser(),
    cleaner({ targets: ['./dist'] }),
    externalGlobals({
      'lodash/fp': '_',
    }),
    sourcemaps(),
  ],
  external: ['lodash/fp'],
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    {
      file: pkg.browser,
      format: 'iife',
      name: 'chooser',
    },
  ],
};
