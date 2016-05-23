
import window from 'window'
import { document, HTMLDivElement } from 'window'
import app from 'app'

const {
  DashboardLayoutLockedEvent,
  SelectorModelSelectedEvent,
  TabsBarTabActivatedEvent
} = app.events

class AppMainElement extends HTMLDivElement {

  createdCallback () {
    // called BEFORE its children are initialized (in Chrome)
  }

  createDemoDashboards () {
    [1, 2, 3].map(idx => {

      const key = `db${idx}`
      const name = `Dashboard #${idx}`

      const dashboard = document.createElement('x-grid-list')
      dashboard.setAttribute('direction', 'horizontal')
      dashboard.setAttribute('lanes', '5')

      const onResize = dashboard.grid.onGridContainerResize
      window.addEventListener('resize', onResize)
      window.addEventListener('DOMContentLoaded', onResize)

      this.dom.tabNavs.appendTab(key, name)
      this.dom.tabPanes.appendContent(key, dashboard)

      return key
    })
  }

  createLocalDom () {
    return {
      tabNavs: this.querySelector('.tjp-tabs'),
      tabPanes: this.querySelector('.tjp-main'),
      toolbar: this.querySelector('.tjp-tool'),
      menu: this.querySelector('.tjp-menu'),
      widgetSelector: this.querySelector('tjp-widget-selector')
    }
  }

  /** @public */
  initialize () {

    this.dom = this.createLocalDom()

    this.createDemoDashboards()
    this.dom.tabNavs.showFirst()

    this.dom.menu.addEventListener(SelectorModelSelectedEvent.EVENT_NAME,
      (event) => { this.showWidgetSelector(event.models) })

    // resize grid when tab becomes active
    this.dom.tabNavs.addEventListener(TabsBarTabActivatedEvent.EVENT_NAME,
    (event) => {

      // TODO use dedicated bootstrap event
      const tab = this.dom.tabPanes.getContent(event.detail.key)

      if (tab) {
        this.currentDashboard = tab.getElementsByTagName('x-grid-list')[0]
      } else {
        this.currentDashboard = undefined
      }

      if (this.currentDashboard) {
        this.currentDashboard.grid.onGridContainerResize()
      }
    })

    this.dom.toolbar.addEventListener(DashboardLayoutLockedEvent.EVENT_NAME,
    (event) => {
      if (event.locked) {
        this.classList.add('tjp-locked-layout')
        this.lockedLayout = true
      } else {
        this.classList.remove('tjp-locked-layout')
        this.lockedLayout = false
      }
    })

    this.classList.add('tjp-locked-layout')

    this.currentDashboard
      = this.dom.tabPanes.getFirst().getElementsByTagName('x-grid-list')[0]
  }

  showWidgetSelector (modelAndInfoList) {

    const models = Object.keys(modelAndInfoList)
    const infos = Object.values(modelAndInfoList)

    const { DeviceInfo, AttributeInfo, CommandInfo } = window.tangojs.core.api
    const readOnly = window.tangojs.core.tango.AttrWriteType.READ

    this.widgetFactoryService
      = new window.tjp.services.WidgetFactoryService(
        window.tangojs.web.components)

    const isAny = (constructor) =>  {
      return !! infos.find(x => x instanceof constructor)
    }

    const avalilableComponentDescriptors
      = this.widgetFactoryService.getAvailableComponentDescriptors({
        // multipleModels: modelAndInfoList.length > 1,
        attributeModel: isAny(AttributeInfo),
        commandModel: isAny(CommandInfo),
        statusModel: isAny(DeviceInfo),
        readOnlyModel: !! infos.find(x => x.writable === readOnly)
      })

    this.dom.widgetSelector
      .showModal(models, avalilableComponentDescriptors)
      .then(([descriptor, attributeMap]) => {

        if (! this.currentDashboard) {
          return
        }

        const tag = descriptor.tagName

        // const modelProperty =
          // descriptor.capabilities.multipleModels ? models : models[0]

        const tpe = descriptor.attributes['model'].type
        const modelProperty = Array.isArray(tpe) ? models : models[0]

        // const modelConverter =
        //   window.tangojs.web.util.converters
        //     .getConvertToAttribute(descriptor.attributes['model'].type)

        attributeMap['model'] = modelProperty // modelConverter(modelProperty)

        const component
          = this.widgetFactoryService.buildComponent(tag, attributeMap)

        if (! component) {
          console.error('failed to instantiate')
          return
        }

        // TODO move sizes to widget descriptors
        let width = 5
        let height = 1
        if (tag === 'tangojs-trend') {
          height = 4
        } else if (tag === 'tangojs-form') {
          height = Math.ceil(models.length/2)
        } else if (tag === 'tangojs-command-button') {
          width = 2

          const model0 = models[0].split('/')
          component.innerText = model0[model0.length-1]
        }

        const card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('card-block')
        card.appendChild(component)

        const lock = document.createElement('div')
        lock.classList.add('tjp-widget-lock')
        lock.draggable = true
        card.appendChild(lock)

        this.currentDashboard.appendGridElement(card, {
          w: width,
          h: height
        })
      })
  }
}

const constructor = document.registerElement('tjp-app', {
  prototype: AppMainElement.prototype,
  extends: 'div'
})

export { constructor as AppMainElement }
