import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
import * as path from "path";

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      include: './src/**/*.ts' ,
      module: 'esnext'
    })
  ],
  external: ['path'],
  output: [
    {format: 'cjs', file: pkg.main, exports: 'auto'},
    {format: 'esm', file: pkg.module}
  ]
}
