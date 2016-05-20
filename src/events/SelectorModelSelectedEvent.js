
import { CustomEvent } from 'window'

const EVENT_NAME = 'app-selector-model-selected'

export default class SelectorModelSelectedEvent extends CustomEvent {

  /**
   * @param {Map<string,(DeviceInfo|AttributeInfo|CommandInfo)>} models
   */
  constructor (models) {
    super(EVENT_NAME, { detail: { models } })
  }

  /**
   * @type {Map<string,(DeviceInfo|AttributeInfo|CommandInfo)>}
   */
  get models () {
    return this.detail.models
  }

  /**
   * @type {string}
   */
  static get EVENT_NAME () {
    return EVENT_NAME
  }
}
