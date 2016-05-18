
import { document, HTMLButtonElement } from 'window'
import app from 'app'

const template = app.util.getCurrentDocument().querySelector('template')

class AppLeftMenuToggleElement extends HTMLButtonElement {

  createdCallback () {

    const clone = document.importNode(template.content, true)
    this.appendChild(clone)

    this.addEventListener('click', function () {
      this.classList.toggle('tjp-bttn-active')
    })
  }
}

const constructor = document.registerElement('tjp-left-menu-toggle', {
  prototype: AppLeftMenuToggleElement.prototype,
  extends: 'button'
})

export { constructor as AppLeftMenuToggleElement }
