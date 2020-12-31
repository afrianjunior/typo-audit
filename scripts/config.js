const path = require('path')
const typescript = require('@rollup/plugin-typescript')
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')

const version = process.env.VERSION || require('../package.json').version

const firstRelease = 2020
const now = new Date().getFullYear()

const banner = `/* !
* Typo Checker Bahasa Indonesia v${version}
* (c) ${firstRelease === now ? firstRelease : firstRelease + ' - ' + now} Afrian Junior
* Released under the MIT License.
*/
`

const resolve = (dest) => {
  return path.resolve(__dirname, '../', dest)
}

const defaultPlugins = [
  typescript({ tslib: require.resolve('tslib') }),
  commonjs({
    include: 'node_modules/**'
  }),
  babel({
    extensions: ['.ts'],
    babelHelpers: 'runtime',
    include: ['src/**/*'],
    exclude: 'node_modules/**'
  }),
]

const defaultExternal = Object.keys(require('../package.json').dependencies)
const defaultGlobals = {
  'axios': 'axios',
  '@lunjs/decode-uri-component': '@lunjs/decode-uri-component',
  'fuse.js': 'fuse.js'
}

const builds = {
  'pkg-dev': {
    entry: resolve('src/core.ts'),
    dest: resolve('dist/typo-audit.dev.js'),
    format: 'cjs',
    env: 'development',
    exports: 'named',
    banner
  },
  'pkg-prod': {
    entry: resolve('src/core.ts'),
    dest: resolve('dist/typo-audit.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  'pkg-cjs-prod': {
    entry: resolve('src/core.ts'),
    dest: resolve('dist/typo-audit.cjs.min.js'),
    format: 'cjs',
    env: 'production',
    exports: 'named',
    banner
  },
  'pkg-esm-prod': {
    entry: resolve('src/core.ts'),
    dest: resolve('dist/typo-audit.esm.min.js'),
    format: 'es',
    env: 'production',
    banner
  },
}

function generateConfig (target) {
  const opts = builds[target]
  const config = {
    input: opts.entry,
    external: [
      ...defaultExternal
    ].concat(opts.external || []),
    plugins: [
      ...defaultPlugins
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'TypoCheckerBahasaIndonesia',
      globals: {
        ...defaultGlobals,
        ...opts.globals
      },
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  if (opts.exports) {
    config.output['exports'] = opts.exports
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: target
  })

  return config
}

if (process.env.TARGET) {
  module.exports = generateConfig(process.env.TARGET)
} else {
  exports.getBuild = generateConfig
  exports.getAllBuilds = () => Object.keys(builds).map(generateConfig)
}