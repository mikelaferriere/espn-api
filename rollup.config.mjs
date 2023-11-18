// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'

const config = {
  input: 'lib/index.ts',
  output: {
    file: 'build/index.js',
    sourcemap: true,
    format: 'cjs',
  },
  external: ['axios'],
  plugins: [commonjs(), typescript()],
}
export default config

// const config_ts = [
//   {
//     file: 'rollup.config.ts',
//     input: 'lib/index.ts',
//     output: {
//       file: 'build/index.js',
//       sourcemap: true,
//       format: 'cjs',
//     },
//     external: ['axios'],
//     plugins: [
//       commonjs(),
//       typescript(),
//     ],
//   },
// ]

// export default config_ts
