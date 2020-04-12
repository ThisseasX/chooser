import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  plugins: [
    typescript(),
    terser(),
    cleaner({ targets: ['./dist'] }),
    sourcemaps(),
  ],
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
  ],
};
