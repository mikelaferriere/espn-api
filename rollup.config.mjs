import typescript from 'rollup-plugin-typescript2'
import { dts } from 'rollup-plugin-dts'

const config = [
  {
    input: 'lib/index.ts',
    output: {
      file: 'build/index.js',
      sourcemap: true,
    },
    external: ['axios'],
    plugins: [typescript()],
  },
  {
    input: 'types.d.ts',
    output: {
      file: 'build/dts/types.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]

export default config
