
import { CustomEvent } from 'window'

const EVENT_NAME = 'app-selector-model-selected'

const SelectorModelSelectedEvent = Object.freeze({

  /**
   * @param {Map<string,(DeviceInfo|AttributeInfo|CommandInfo)>} models
   */
  create (models) {
    return new CustomEvent(EVENT_NAME, { detail: { models } })
  },

  /**
   * @type {string}
   */
  EVENT_NAME
})

export default SelectorModelSelectedEvent
