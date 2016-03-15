(function (window) {
  'use strict'

  const document = window.document

  // TODO these descriptors should be definied on each widget
  // in tangojs-web-components

  const widgetDescriptors = {
    'tangojs-label': {
      description: 'Simple field for read-onlyattributes.',
      allowMultipleModels: false,
      allowAttributes: true,
      allowCommands: false,
      allowStatus: false,
      allowReadOnly: true,
      attributes: {
        'poll-period': {
          description: 'Device pooling period',
          type: 'number',
          value: 1000
        },
        'show-name': {
          description: 'Show attribute name',
          type: 'boolean',
          value: true
        },
        'show-unit': {
          description: 'Show attribute unit',
          type: 'boolean',
          value: true
        },
        'show-quality': {
          description: 'Show attribute quality',
          type: 'boolean',
          value: true
        }
      }
    },
    'tangojs-line-edit': {
      description: 'Simple field for read-write attributes.',
      allowMultipleModels: false,
      allowAttributes: true,
      allowCommands: false,
      allowStatus: false,
      allowReadOnly: false,
      attributes: {
        'poll-period': {
          description: 'Device pooling period',
          type: 'number',
          value: 1000
        },
        'show-name': {
          description: 'Show attribute name',
          type: 'boolean',
          value: true
        },
        'show-unit': {
          description: 'Show attribute unit',
          type: 'boolean',
          value: true
        },
        'show-quality': {
          description: 'Show attribute quality',
          type: 'boolean',
          value: true
        }
      }
    },
    'tangojs-command-button': {
      description: 'Command button that executes command on a device.',
      allowMultipleModels: false,
      allowAttributes: false,
      allowCommands: true,
      allowStatus: false,
      allowReadOnly: false,
      attributes: {
        'parameters': {
          description: 'Parameters passed to the deivce',
          value: 'string',
          value: undefined
        }
      }
    },
    'tangojs-state-led': {
      description: 'Visualizes device state and status.',
      allowMultipleModels: false,
      allowAttributes: false,
      allowCommands: false,
      allowStatus: true,
      allowReadOnly: false,
      attributes: {
        'poll-period': {
          description: 'Device pooling period',
          type: 'number',
          value: 1000
        },
        'show-name': {
          description: 'Show device name',
          type: 'boolean',
          value: true
        },
        'show-led': {
          description: 'Show state led',
          type: 'boolean',
          value: true
        }
      }
    },
    'tangojs-trend': {
      description: 'Trend plot of multiple time-varying attributes.',
      allowMultipleModels: true,
      allowAttributes: true,
      allowCommands: false,
      allowStatus: false,
      allowReadOnly: true,
      attributes: {
        'poll-period': {
          description: 'Device pooling period',
          type: 'number',
          value: 1000
        },
        'data-limit': {
          description: 'Max. no. of entries',
          type: 'number',
          value: 20
        },
      }
    },
    'tangojs-form': {
      description: 'Visualizes multiple attributes on a single form.',
      allowMultipleModels: true,
      allowAttributes: true,
      allowCommands: true,
      allowStatus: true,
      allowReadOnly: true,
      attributes: {
        'poll-period': {
          description: 'Device pooling period',
          type: 'number',
          value: 1000
        }
      }
    }
  }

  const { AttributeInfo, CommandInfo } = window.tangojs.struct
  const readOnly = window.tangojs.tango.AttrWriteType.READ
  const isString = (s => s instanceof String || typeof s === 'string')

  window.tjp.widgetFactory = {

    /**
     * @param {Array<Object>} modelData
     */
    getAvailableWidgetsDescriptors: function (modelData) {

      /* modelData entries may be:
       *   - AttributeInfo
       *   - CommandInfo
       *   - string         // TODO change to DeviceInfo
       */

      const anyAttribute = modelData.find(m => m instanceof AttributeInfo)
      const anyCommand = modelData.find(m => m instanceof CommandInfo)
      const anyStatus = modelData.find(m => isString(m))
      const anyReadOnly = modelData.find(m => m.writable == readOnly)

      return Object.keys(widgetDescriptors).reduce((result, tag) => {
        const desc = widgetDescriptors[tag]
        if ((! desc.allowMultipleModels && modelData.length !== 1) ||
            (! desc.allowAttributes && anyAttribute) ||
            (! desc.allowCommands && anyCommand) ||
            (! desc.allowStatus && anyStatus) ||
            (! desc.allowReadOnly && anyReadOnly)) {
          // pass
        } else {
          result[tag] = desc
        }
        return result
      }, {})
    },

    buildWidget: function (tag, modelArray, attributes) {

      const widget = document.createElement(tag)

      if (widgetDescriptors[tag].allowMultipleModels) {
        widget.model = modelArray
      } else {
        widget.setAttribute('model', modelArray[0])
      }

      Object.keys(attributes).forEach(key => {

        const attribute = attributes[key]
        const type = attribute.type

        if (type == 'string') {
          widget.setAttribute(key, attribute.value)
        } else if (type == 'number') {
          widget.setAttribute(key, attribute.value)
        } else if (type == 'boolean' && attribute.value) {
          widget.setAttribute(key, '')
        }
      })

      return widget
    }
  }

})(window)
