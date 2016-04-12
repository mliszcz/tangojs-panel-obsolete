(function (window) {
  'use strict'

  const document = window.document

  /**
   * Factory for TangoJS widgets / components.
   */
  class WidgetFactoryService {

    /**
     * @param {Object} componentContainer
     */
    constructor (componentContainer) {
      this.componentContainer = componentContainer
    }

    /**
     * @param {string} tagName
     * @return {tango.components.util.ComponentDescriptor}
     * @private
     */
    resolveTag (tagName) {
      const constructor = Object.values(this.componentContainer).find(e => {
        return e.descriptor.tag == tagName
      })
      return constructor ? constructor.descriptor : undefined
    }

    /**
     * @param {tango.components.util.ComponentDescriptor} descriptor
     * @param {window.tangojs.web.util.ComponentCapabilities} requiredCapability
     * @return {boolean}
     * @private
     */
    areCapabilitiesSupported (descriptor, requiredCapability) {
      return !Object.keys(requiredCapability).find(cap => {
        return (requiredCapability[cap] === true &&
          !descriptor.capabilities[cap])
      })
    }

    /**
    * @param {window.tangojs.web.util.ComponentCapabilities} requiredCapability
    * @return {Array<window.tangojs.web.util.ComponentDescriptor>}
    */
    getAvailableComponentDescriptors (requiredCapability) {
      return Object.values(this.componentContainer).filter(e => {
        return this.areCapabilitiesSupported(e.descriptor, requiredCapability)
      }).map(e => e.descriptor)
    }

    /**
     * @param {string} tagName
     * @param {Object} attributeMap
     * @param {DocumentFragment} content
     * @return {HTMLElement}
     */
    buildComponent (tagName, attributeMap = {}, content = undefined) {

      const descriptor = this.resolveTag(tagName)

      if (descriptor) {
        const attributes = Object.assign({},
                                         descriptor.attributes,
                                         attributeMap)
        const component = document.createElement(descriptor.tag)
        Object.entries(attributes).forEach(([name, value]) => {
          // FIXME value is assumed to be a DOMString
          // use synchronization logic
          component.setAttribute(name, value)
        })
        if (content) {
          component.appendChild(content)
        }
        return component
      } else {
        return undefined
      }
    }
  }

  window.tjp = window.tjp || {}
  window.tjp.services = window.tjp.services || {}
  window.tjp.services.WidgetFactoryService = WidgetFactoryService

})(window)
