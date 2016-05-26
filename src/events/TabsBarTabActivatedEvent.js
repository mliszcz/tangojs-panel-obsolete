
import { CustomEvent } from 'window'

const EVENT_NAME = 'tabs-bar-tab-activated'

const TabsBarTabActivatedEvent = Object.freeze({

  /**
   * @param {string} key
   */
  create (key) {
    return new CustomEvent(EVENT_NAME, { detail: { key } })
  },

  /**
   * @type {string}
   */
  EVENT_NAME
})

export default TabsBarTabActivatedEvent
