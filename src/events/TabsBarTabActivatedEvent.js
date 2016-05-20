
import { CustomEvent } from 'window'

const EVENT_NAME = 'tabs-bar-tab-activated'

export default class TabsBarTabActivatedEvent extends CustomEvent {

  /**
   * @param {string} key
   */
  constructor (key) {
    super(EVENT_NAME, { detail: { key } })
  }

  /**
   * @type {string}
   */
  get key () {
    return this.detail.key
  }

  /**
   * @type {string}
   */
  static get EVENT_NAME () {
    return EVENT_NAME
  }
}
