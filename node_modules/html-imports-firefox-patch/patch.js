(function (window) {
  'use strict'

  // http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  const isFirefox = typeof InstallTrigger !== 'undefined'

  const importProperty = 'import'
  const linkPrototype = window.HTMLLinkElement.prototype

  if (isFirefox && importProperty in linkPrototype) {
    delete linkPrototype[importProperty]
  }

})(window);
