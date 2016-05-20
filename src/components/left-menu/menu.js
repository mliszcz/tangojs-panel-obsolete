
import { document, HTMLDivElement } from 'window'
import app from 'app'

const { SelectorModelSelectedEvent } = app.events

const template = app.util.getCurrentDocument().querySelector('template')

class AppLeftMenuElement extends HTMLDivElement {

  createdCallback () {
    const clone = document.importNode(template.content, true)
    this.appendChild(clone)

    const tree = document.getElementsByTagName('tangojs-device-tree')[0]
    const btnAddWidget = document.getElementById('btn-add-widget')
    const btnClearTree = document.getElementById('btn-clear-tree')
    const btnReloadTree = document.getElementById('btn-reload-tree')

    const disableButtons = (disable) => {
      btnClearTree.disabled = disable
      btnAddWidget.disabled = disable
    }

    disableButtons(true)

    btnClearTree.addEventListener('click', () => tree.clearSelections())

    btnAddWidget.addEventListener('click', () => {

      const models = tree.getSelections().reduce((acc, e) => {
        acc[e.value.model] = e.value.info
        return acc
      }, {})

      tree.clearSelections()
      disableButtons(true)
      this.dispatchEvent(new SelectorModelSelectedEvent(models))
    })

    btnReloadTree.addEventListener('click', () => {
      tree.reloadDeviceTree()
      disableButtons(true)
    })

    tree.addEventListener('selected', (event) => {
      disableButtons(event.detail.selections.length < 1)
    })
  }
}

const constructor = document.registerElement('tjp-left-menu', {
  prototype: AppLeftMenuElement.prototype,
  extends: 'div'
})

export { constructor as AppLeftMenuElement }
