
const rollup = require( 'rollup' )
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const SOURCE_DIR = 'src/components'
const DEST_DIR = 'dist/components'

const MODULE_NAME = 'tjp.components'

const FORMAT = 'iife'

const EXTERNAL_MODULES = [
  'window',
  'jQuery',
  'tag',
  'tangojs-core',
  'tangojs-web-components',
  'app'
]

const GLOBALS = {
  'window': 'window',
  'jQuery': 'window.$',
  'tag': 'window.tag',
  'tangojs-core': 'window.tangojs.core',
  'tangojs-web-components': 'window.tangojs.web',
  'app': 'tjp'
}

const jsFiles = glob.sync('**/*.js', { cwd: SOURCE_DIR })

const bundlePromises = jsFiles.map(file => {
  return rollup.rollup({
    entry: path.join(SOURCE_DIR, file),
    external: EXTERNAL_MODULES
  })
  .then(bundle => {
    console.log('bundling', file) // eslint-disable-line
    return bundle.write({
      format: FORMAT,
      dest: path.join(DEST_DIR, file),
      moduleName: MODULE_NAME,
      sourceMap: true,
      globals: GLOBALS
    })
  })
})

Promise.all(bundlePromises).then(() => {
  const htmlFiles = glob.sync('**/*.html', { cwd: SOURCE_DIR })
  htmlFiles.forEach(file => {
    console.log('copying', file) // eslint-disable-line
    fs.createReadStream(path.join(SOURCE_DIR, file))
      .pipe(fs.createWriteStream(path.join(DEST_DIR, file)))
  })
})
.catch(error => {
  console.error(error)
  process.exit(1)
})
