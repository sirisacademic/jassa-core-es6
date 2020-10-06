import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as meta from './package.json';

export default {
    input: 'src/newindex.js',
    external: ['lodash','bluebird'], //Object.keys(meta.dependencies || {}),
    plugins: [
        nodeResolve()
    ],
    output: {
        file: 'dist/jassa.js',
        format: 'umd',
        indent: false,
        name: 'jassa'
    }
}