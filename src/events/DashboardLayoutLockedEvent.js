
import { CustomEvent } from 'window'

const EVENT_NAME = 'app-dashboard-layout-locked'

const DashboardLayoutLockedEvent = Object.freeze({

  /**
   * @param {boolean} locked
   */
  create (locked) {
    return new CustomEvent(EVENT_NAME, { detail: { locked } })
  },

  /**
   * @type {string}
   */
  EVENT_NAME
})

export default DashboardLayoutLockedEvent
