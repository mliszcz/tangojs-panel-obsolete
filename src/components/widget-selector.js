
import { document, HTMLDivElement } from 'window'
import tag from 'tag'
import app from 'app'

const FORM_COMPONENTS_NAME = 'component'

const template = app.util.getCurrentDocument().querySelector('template')

/**
 * @param {HTMLElement} node
 */
function removeAllChildren (node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.firstChild)
  }
}

/**
 * @param {Object} dom
 * @param {HTMLElement} dom.models
 * @param {HTMLElement} dom.components
 * @param {HTMLElement} dom.attributes
 */
function resetView (dom) {
  removeAllChildren(dom.models)
  removeAllChildren(dom.components)
  removeAllChildren(dom.attributes)
}

/**
 * @param {string[]} models
 * @return {DocumentFragment}
 */
function createModelsView (models) {
  return tag('ul', { class: 'list-unstyled' }, models.map(m => tag('li', m)))
}

/**
 * @param {Object[]} descriptors
 * @return {HTMLFormElement}
 */
function createComponentsForm (descriptors) {
  return tag('form', descriptors.map(({ tagName, description }) => {
    return createComponentsFormEntry(tagName, description)
  }))
}

/**
 * @param {string} tagName
 * @param {string} description
 * @return {HTMLElement}
 */
function createComponentsFormEntry (tagName,
                                    description = 'no description provided') {
  return tag('div', { class: 'radio' }, [
    tag('label', [
      tag('input', {
        type: 'radio',
        name: FORM_COMPONENTS_NAME,
        value: tagName
      }),
      tag('strong', tagName)
    ]),
    tag('p', description)
  ])
}

/**
 * @param {Object[]} descriptors
 * @return {Map<string, HTMLFormElement>}
 */
function createAttributesForms (descriptors) {
  return descriptors.reduce((map, descriptor) => {
    map[descriptor.tagName] = createAttributesForm(descriptor)
    return map
  }, {})
}

/**
 * @param {Object} descriptor
 * @return {HTMLFormElement}
 */
function createAttributesForm (descriptor) {

  const entries = Object.entries(descriptor.attributes)
    .filter(([name, { type }]) => name !== 'model' && isTypeSupported(type))

  return tag('form', entries.map(([name, { type }]) => {
    return tag('div', { class: 'form-group row' }, [
      tag('label', {
        for: `fi-${name}`,
        class: 'col-sm-6 form-control-label'
      }, name),
      tag('div', { class: 'col-sm-6' }, [
        tag('input', Object.assign({
          type: getInputType(type),
          class: 'form-control',
          id: `fi-${name}`,
          name: name
        }, getInitialValue(name)))
      ])
    ])
  }))
}

function isTypeSupported (type) {
  return [String, Number, Boolean].includes(type)
}

function getInputType (type) {
  switch (type) {
    case String: return 'text'
    case Number: return 'number'
    case Boolean: return 'checkbox'
  }
}

function getInitialValue (name) {
  if (name === 'poll-period') {
    return { value: 1000 }
  } else if (name.startsWith('show-')) {
    return { checked: true }
  } else {
    return {}
  }
}

function extractValueFromNode (node, type) {
  switch (type) {
    case String: return node.value
    case Number: return parseFloat(node.value)
    case Boolean: return node.checked
  }
}

class AppWidgetSelectorElement extends HTMLDivElement {

  createdCallback () {

    const clone = document.importNode(template.content, true)
    this.appendChild(clone)

    /** @private */
    this.dom = {
      modal: this.querySelector('*[is="x-modal-window"]'),
      form: this.querySelector('form'),
      models: this.querySelector('*[data-id="models"]'),
      components: this.querySelector('*[data-id="components"]'),
      attributes: this.querySelector('*[data-id="attributes"]')
    }
  }

  /**
   * @private
   */
  selectFirstRadio () {
    const first = this.dom.components.querySelector('input[type="radio"]')
    if (first) {
      first.checked = true
      this.dom.modal.dom.btnAccept.disabled = false
    } else {
      this.dom.modal.dom.btnAccept.disabled = true
    }
  }

  /**
   * @param {Array<Object>} availableWidgets
   * @return {Promise<[string, Object]>}
   */
  showModal (models, descriptors) {

    resetView(this.dom)

    this.dom.models.appendChild(createModelsView(models))

    const componentsForm = createComponentsForm(descriptors)
    const attributesForms = createAttributesForms(descriptors)

    this.dom.components.appendChild(componentsForm)

    const onComponentSelected = () => {
      removeAllChildren(this.dom.attributes)
      const selectedTag = componentsForm[FORM_COMPONENTS_NAME].value
      const attributesForm = attributesForms[selectedTag]
      if (attributesForm) {
        this.dom.attributes.appendChild(attributesForm)
      }
    }

    componentsForm.addEventListener('change', onComponentSelected)

    this.selectFirstRadio()
    onComponentSelected()

    return this.dom.modal.showModal(() => {

      const selectedTag = componentsForm[FORM_COMPONENTS_NAME].value
      const descriptor = descriptors.find(x => x.tagName === selectedTag)

      const attributeMap = Object.entries(descriptor.attributes)
      .reduce((map, [attribute, { type }]) => {
        const input = attributesForms[selectedTag].elements[attribute]
        if (input) {
          map[attribute] = extractValueFromNode(input, type)
        }
        return map
      }, {})

      componentsForm.removeEventListener('change', onComponentSelected)

      return Promise.resolve([descriptor, attributeMap])
    })
  }
}

const constructor = document.registerElement('tjp-widget-selector', {
  prototype: AppWidgetSelectorElement.prototype
})

export { constructor as AppWidgetSelectorElement }
