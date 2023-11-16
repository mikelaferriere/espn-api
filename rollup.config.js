import typescript from 'rollup-plugin-typescript2'
import { dts } from 'rollup-plugin-dts'

const config = [
  {
    input: 'lib/index.ts',
    output: {
      file: 'build/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['axios'],
    plugins: [typescript()],
  },
  {
    input: 'index.d.ts',
    output: {
      file: 'build/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]

export default config
