
import { document, HTMLDivElement, CustomEvent } from 'window'
import app from 'app'

const template = app.util.getCurrentDocument().querySelector('template')

class CreateWidgetRequestEvent extends CustomEvent {

  /**
   * @typedef {DeviceInfo|AttributeInfo|CommandInfo} AnyInfo
   * @param {Array<({model: string, info: AnyInfo})>} modelList
   */
  constructor (modelList) {
    super('create-widget', {
      detail: {modelList}
    })
  }
}

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

    // const extractModel = (treeEntry) => {
    //   const path = treeEntry.path
    //   // console.log('EXTRACTING', path)
    //   if (path[path.length-1] === 'status') {
    //     const newPath = path.slice()
    //     newPath.length = path.length-1
    //     // console.log('returning', newPath)
    //     return newPath
    //   } else {
    //     const newPath = path.slice()
    //     newPath[path.length-2] = path[path.length-1]
    //     newPath.length = path.length-1
    //     return newPath
    //   }
    // }

    disableButtons(true)

    btnClearTree.addEventListener('click', () => tree.clearSelections())

    btnAddWidget.addEventListener('click', () => {
      const modelData = tree.getSelections().map(x => x.value)
      const ev = new CreateWidgetRequestEvent(modelData)
      tree.clearSelections()
      disableButtons(true)
      this.dispatchEvent(ev)
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
