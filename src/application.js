
import * as _util from './util'

import DashboardLayoutLockedEvent from './events/DashboardLayoutLockedEvent'
import SelectorModelSelectedEvent from './events/SelectorModelSelectedEvent'
import TabsBarTabActivatedEvent from './events/TabsBarTabActivatedEvent'

import WidgetFactoryService from './services/WidgetFactoryService'

export const components = { }

export const util = _util

export const events = {
  DashboardLayoutLockedEvent,
  SelectorModelSelectedEvent,
  TabsBarTabActivatedEvent
}

export const services = {
  WidgetFactoryService
}
