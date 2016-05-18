
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
 * Creates attribute map with sane values.
 * @param {tango.components.util.ComponentDescriptor} descriptor
 * @return {Map<string,Object>}
 */
function buildDefaultAttributes (descriptor) {
  return Object.keys(descriptor.attributes).reduce((acc, attribute) => {
    if (attribute === 'poll-period') {
      acc[attribute] = 1000
    } else if (attribute.startsWith('show-')) {
      acc[attribute] = true
    } else {
      // fall-back to default attribute defined in component
      // acc[attribute] = getDefaultValue(descriptor.attributes[attribute].type)
    }
    return acc
  }, {})
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

    const attributes
      = Object.assign({}, buildDefaultAttributes(descriptor), attributeMap)

    const component = document.createElement(descriptor.tagName)

    Object.entries(attributes).forEach(([name, value]) => {
      const convert = getConvertToAttribute(descriptor.attributes[name].type)
      component.setAttribute(name, convert(value))
    })

    if (content) {
      component.appendChild(content)
    }

    return component
  }
}
