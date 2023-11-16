import typescript from 'rollup-plugin-typescript2'

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
]

export default config
