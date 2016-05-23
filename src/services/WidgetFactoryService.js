
import { document } from 'window'
import { util as webutil } from 'tangojs-web-components'

const { getConvertToAttribute } = webutil.converters

/**
 * @param {string} tagName
 * @return {tango.components.util.ComponentDescriptor}
 */
function resolveTagToDescriptor (tagName, componentContainer) {
  const constructor = Object.values(componentContainer).find(e => {
    return e.descriptor && e.descriptor.tagName === tagName
  })
  return constructor ? constructor.descriptor : undefined
}

/**
 * @param {tango.components.util.ComponentDescriptor} descriptor
 * @param {window.tangojs.web.util.ComponentCapabilities} requiredCapabilities
 * @return {boolean}
 */
function areCapabilitiesSupported (descriptor, requiredCapabilities) {
  return descriptor && ! Object.keys(requiredCapabilities).find(c => {
    return (requiredCapabilities[c] === true && ! descriptor.capabilities[c])
  })
}

/**
 * @param {HTMLElement} node
 * @param {string} name
 * @param {Function} type
 * @param {*} value
 */
function setAttribute (node, name, type, value) {
  if (type === Boolean) {
    if (value === true) {
      node.setAttribute(name, '')
    } else {
      node.removeAttribute(name)
    }
  } else {
    const convert = getConvertToAttribute(type)
    node.setAttribute(name, convert(value))
  }
}

/**
 * Factory for TangoJS widgets / components.
 */
export default class WidgetFactoryService {

  /**
   * @param {Object} componentContainer
   */
  constructor (componentContainer) {
    /** @private */
    this.componentContainer = componentContainer
  }

  /**
   * @param {window.tangojs.web.util.ComponentCapabilities} requiredCapabilities
   * @return {Array<window.tangojs.web.util.ComponentDescriptor>}
  */
  getAvailableComponentDescriptors (requiredCapabilities) {
    return Object.values(this.componentContainer).filter(e => {
      return areCapabilitiesSupported(e.descriptor, requiredCapabilities)
    }).map(e => e.descriptor)
  }

  /**
   * @param {string} tagName
   * @param {Map<string,Object>} attributeMap
   * @param {DocumentFragment} content
   * @return {HTMLElement}
   */
  buildComponent (tagName, attributeMap = {}, content = undefined) {

    const descriptor = resolveTagToDescriptor(tagName, this.componentContainer)

    if (! descriptor) {
      return undefined
    }

    const component = document.createElement(descriptor.tagName)

    Object.entries(attributeMap).forEach(([name, value]) => {
      setAttribute(component, name, descriptor.attributes[name].type, value)
    })

    if (content) {
      component.appendChild(content)
    }

    return component
  }
}
