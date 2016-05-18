
import { document, HTMLDivElement } from 'window'

class AppTabsContentElement extends HTMLDivElement {

  createdCallback () {
    this.tabs = []
  }

  appendContent (key, content) {

    const div = document.createElement('div')
    div.classList.add('tab-pane')
    div.setAttribute('id', key)
    div.setAttribute('role', 'tabpanel')
    div.appendChild(content)

    this.appendChild(div)
    this.tabs[key] = div
  }

  removeContent (key) {
    const tab = this.tabs[key]
    if (tab) {
      this.removeChild(tab)
      delete this.tabs[key]
    }
  }

  getContent (key) {
    return this.tabs[key]
  }

  getFirst () {
    return this.tabs[Object.keys(this.tabs)[0]]
  }
}

const constructor = document.registerElement('tjp-tabs-content', {
  prototype: AppTabsContentElement.prototype,
  extends: 'div'
})

export { constructor as AppTabsContentElement }
