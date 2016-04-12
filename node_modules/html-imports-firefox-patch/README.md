# html-imports-firefox-patch

HTML Imports implementation seems to be broken in Firefox. Enabling
`dom.webcomponents.enabled` adds `import` attribute to the `HTMLLinkElement`.
This forces HTML Imports polyfill to fall-back to the native implementation.

This patch removes corresponding property from the `HTMLLinkElement.prototype`.

Needs to be loaded before the HTML Imports polyfill.

For more details regarding the issue see:  
https://github.com/webcomponents/webcomponentsjs/issues/289
