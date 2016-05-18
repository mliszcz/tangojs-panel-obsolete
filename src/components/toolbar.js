
import { document, HTMLDivElement, CustomEvent } from 'window'
import app from 'app'

const template = app.util.getCurrentDocument().querySelector('template')

class AppToolbarElement extends HTMLDivElement {

  createdCallback () {
    const clone = document.importNode(template.content, true)
    this.appendChild(clone)

    this.dom = {
      btnDelete: this.querySelector('#btn-tool-delete'),
      btnExport: this.querySelector('#btn-tool-export'),
      btnLock: this.querySelector('#btn-tool-lock'),
      btnUnlock: this.querySelector('#btn-tool-unlock')
    }

    this.dom.btnDelete.disabled = true
    this.dom.btnExport.disabled = true

    this.dom.btnLock.disabled = true // locked at start
    this.dom.btnUnlock.disabled = false

    this.dom.btnLock.addEventListener('click', () => {
      this.dom.btnLock.disabled = ! this.dom.btnLock.disabled
      this.dom.btnUnlock.disabled = ! this.dom.btnUnlock.disabled
      this.dispatchEvent(new CustomEvent('tjp-click-lock', {}))
    })

    this.dom.btnUnlock.addEventListener('click', () => {
      this.dom.btnLock.disabled = ! this.dom.btnLock.disabled
      this.dom.btnUnlock.disabled = ! this.dom.btnUnlock.disabled
      this.dispatchEvent(new CustomEvent('tjp-click-unlock', {}))
    })
  }
}

const constructor = document.registerElement('tjp-toolbar', {
  prototype: AppToolbarElement.prototype,
  extends: 'div'
})

export { constructor as AppToolbarElement }
