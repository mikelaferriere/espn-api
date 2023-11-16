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
    input: 'index.d.ts',
    output: {
      file: 'build/dts/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]

export default config
