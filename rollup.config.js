// import {dts} from 'rollup-plugin-dts'
// import typescript from "rollup-plugin-typescript2"
// const pkg = require("./package.json")

// const config = [
//     // your default rollup config for transpilation and bundling
//     {
//         input: 'lib/index.ts',
//         output: [
//           {
//             file: pkg.main,
//             format: 'cjs',
//             exports: 'named',
//             sourcemap: true,
//             strict: false
//           },
//         ],
//         plugins: [
//           typescript(),
//           dts(),
//         ],
//     },
//     {
//       // path to your declaration files root
//       input: './index.d.ts',
//       output: [{ file: 'build/dts/index.d.ts', format: 'es' }],
//       plugins: [
//         typescript(),
//         dts(),
//       ],
//     },
//   ]
// export default config

import typescript from 'rollup-plugin-typescript2';
import {dts} from "rollup-plugin-dts";
const config = [
  {
    input: 'build/lib/index.js',
    output: {
      file: 'index.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [typescript()]
  }, {
    input: 'build/lib/index.d.ts',
    output: {
      file: 'index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];

export default config;