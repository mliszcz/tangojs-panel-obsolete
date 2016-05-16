
export default {
  entry: 'app/Application.js',
  dest: 'dist/tangojs-panel.js',
  format: 'iife',
  moduleName: 'tjp',
  plugins: [],
  external: [
    'tangojs-core',
    'tangojs-web-components',
    'window'
  ],
  globals: {
    'tangojs-core': 'tangojs.core',
    'tangojs-web-components': 'tangojs.web',
    'window': 'window'
  },
  sourceMap: true
}
