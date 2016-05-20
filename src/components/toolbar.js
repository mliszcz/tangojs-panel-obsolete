
import { document, HTMLDivElement } from 'window'
import app from 'app'

const { DashboardLayoutLockedEvent } = app.events

const template = app.util.getCurrentDocument().querySelector('template')

class AppToolbarElement extends HTMLDivElement {

  createdCallback () {

    const clone = document.importNode(template.content, true)
    this.appendChild(clone)

    const btnDelete = this.querySelector('button[data-id="delete"]')
    const btnExport = this.querySelector('button[data-id="export"]')
    const btnLock = this.querySelector('button[data-id="lock"]')
    const btnUnlock = this.querySelector('button[data-id="unlock"]')

    btnDelete.disabled = true
    btnExport.disabled = true
    btnLock.disabled = true
    btnUnlock.disabled = false

    const makeToggleLock = (locked) => () => {
      btnLock.disabled = ! btnLock.disabled
      btnUnlock.disabled = ! btnUnlock.disabled
      this.dispatchEvent(new DashboardLayoutLockedEvent(locked))
    }

    btnLock.addEventListener('click', makeToggleLock(true))
    btnUnlock.addEventListener('click', makeToggleLock(false))
  }
}

const constructor = document.registerElement('tjp-toolbar', {
  prototype: AppToolbarElement.prototype,
  extends: 'div'
})

export { constructor as AppToolbarElement }
