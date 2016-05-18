
export default {
  entry: 'src/application.js',
  dest: 'dist/tangojs-panel.js',
  format: 'iife',
  moduleName: 'tjp',
  plugins: [],
  external: [
    'window',
    'tangojs-core',
    'tangojs-web-components'
  ],
  globals: {
    'window': 'window',
    'tangojs-core': 'tangojs.core',
    'tangojs-web-components': 'tangojs.web'
  },
  sourceMap: true
}
