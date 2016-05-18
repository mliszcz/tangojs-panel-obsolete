
import { document, HTMLDivElement } from 'window'
import app from 'app'

const template = app.util.getCurrentDocument().querySelector('template')

class AppLeftMenuSectionElement extends HTMLDivElement {

  createdCallback () {

    this.classList.add('panel')
    this.classList.add('panel-default')

    const clone = document.importNode(template.content, true)

    const id = this.getAttribute('panel-id')
    const dataParent = this.getAttribute('panel-data-parent')
    const expanded = this.getAttribute('panel-expanded')

    const a = clone.querySelector('a[href="#id-placeholder"]')
    a.innerText = this.getAttribute('panel-title')
    a.setAttribute('href', `#${id}`)
    a.setAttribute('data-parent', `${dataParent}`)

    const div = clone.querySelector('div[id="id-placeholder"]')
    div.setAttribute('id', id)

    if (expanded !== null) {
      div.classList.add('in')
    }

    while (this.hasChildNodes()) {
      div.appendChild(this.firstChild)
    }

    this.appendChild(clone)
  }
}

const constructor = document.registerElement('tjp-left-menu-section', {
  prototype: AppLeftMenuSectionElement.prototype,
  extends: 'div'
})

export { constructor as AppLeftMenuSectionElement }
