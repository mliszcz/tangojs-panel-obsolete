
import { document } from 'window'
import { components } from './Application'

export function getCurrentDocument () {
  const currentScript = (document._currentScript || document.currentScript)
  return currentScript.ownerDocument
}

export function registerComponent (tagName, constructor) {
  const registeredConstructor = document.registerElement(tagName, {
    prototype: constructor.prototype
  })
  components[constructor.name] = registeredConstructor
  return registeredConstructor
}

export function registerInheritedComponent (tagName, tagBase, constructor) {
  const registeredConstructor = document.registerElement(tagName, {
    prototype: constructor.prototype,
    extends: tagBase
  })
  components[constructor.name] = registeredConstructor
  return registeredConstructor
}
