const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const zlib = require('zlib')
const terser = require('terser')

const version = process.env.VERSION || require('../package.json').version

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

let builds = require('./config').getAllBuilds()

function build (builds) {
  console.log(`\nPreparation for ${builds.length} packages... \n`)
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      } else {
        console.log(`\n Time to release version ${version}!`)
      }
    }).catch(logError)
  }

  next()
}

function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /(min|prod)\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(async ({ output: [{ code }] }) => {
      if (isProd) {
        const minified = await terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        })
        return write(file, (banner ? banner + '\n' : '') + minified.code, true)
      } else {
        return write(file, code)
      }
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(textToGreen(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function textToGreen (str) {
  return '\x1b[1m\x1b[32m' + str + '\x1b[39m\x1b[22m'
}

build(builds)