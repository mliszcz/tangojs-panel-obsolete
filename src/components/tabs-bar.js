
import { document, HTMLUListElement } from 'window'
import jQuery from 'jQuery'
import app from 'app'

const { TabsBarTabActivatedEvent } = app.events

class AppTabsBarElement extends HTMLUListElement {

  createdCallback () {

    /** @private */
    this.tabs = []
  }

  /**
   * @param {string} key
   * @param {string} text
   */
  appendTab (key, text) {

    const a = document.createElement('a')
    a.classList.add('nav-link')
    a.setAttribute('data-toggle', 'tab')
    a.setAttribute('href', `#${key}`)
    a.setAttribute('role', 'tab')
    a.innerText = text

    const tab = document.createElement('li')
    tab.classList.add('nav-item')
    tab.appendChild(a)

    jQuery(a).on('shown.bs.tab', () => {
      this.dispatchEvent(new TabsBarTabActivatedEvent(key))
    })

    this.appendChild(tab)
    this.tabs[key] = tab
  }

  /**
   * @param {string} key
   */
  removeTab (key) {
    const tab = this.tabs[key]
    if (tab) {
      this.removeChild(tab)
      delete this.tabs[key]
    }
  }

  /**
   */
  showFirst () {
    const first = this.firstChild
    if (first) {
      jQuery(first.getElementsByTagName('a')[0]).tab('show')
    }
  }
}

const constructor = document.registerElement('tjp-tabs-bar', {
  prototype: AppTabsBarElement.prototype,
  extends: 'ul'
})

export { constructor as AppTabsBarElement }
