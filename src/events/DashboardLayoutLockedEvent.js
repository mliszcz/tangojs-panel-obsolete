
import { CustomEvent } from 'window'

const EVENT_NAME = 'app-dashboard-layout-locked'

export default class DashboardLayoutLockedEvent extends CustomEvent {

  /**
   * @param {boolean} locked
   */
  constructor (locked) {
    super(EVENT_NAME, { detail: { locked } })
  }

  /**
   * @type {boolean}
   */
  get locked () {
    return this.detail.locked === true
  }

  /**
   * @type {string}
   */
  static get EVENT_NAME () {
    return EVENT_NAME
  }
}
