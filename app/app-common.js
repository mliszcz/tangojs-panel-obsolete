(function (window) {
  'use strict'

  const document = window.document

  window.tjp = window.tjp || {}
  window.tjp.components =  window.tjp.components || {}

  window.tjp.util = window.tjp.util || {

    getCurrentDocument: function (window) {
      const document = window.document
      const currentScript = (document._currentScript || document.currentScript)
      return currentScript.ownerDocument
    },

    registerComponent: function (constructor, htmlElementName) {
      const nodeConstructor = document.registerElement(htmlElementName, {
        prototype: constructor.prototype
      })
      window.tjp.components[constructor.name] = nodeConstructor
      return nodeConstructor
    },

    registerInheritedComponent: function (constructor,
                                          htmlElementName,
                                          superElementName) {
      const nodeConstructor = document.registerElement(htmlElementName, {
        prototype: constructor.prototype,
        extends: superElementName
      })
      window.tjp.components[constructor.name] = nodeConstructor
      return nodeConstructor
    }

  }

})(window)
