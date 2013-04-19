(function () {
  'use strict';

  //the most basic selector engine ever
  //for more use Sizzle https://github.com/jquery/sizzle/blob/master/sizzle.js
  function querySelectorAll(selector) {
    if (/^[\w-]+$/.test(selector)) {
      return toArray(document.getElementsByTagName(selector));

    } else if (/^#[\w-]+$/.test(selector)) {
      return [document.getElementById(selector.slice(1))];

    } else if (/^\.[\w-]+$/.test(selector)) {
      var allEls = toArray(document.getElementsByTagName('*')),
        className = selector.slice(1),
        pattern = new RegExp('\\b' + className + '\\b');

      return allEls.filter(function (item) {
        return pattern.test(item.className);
      });

    }
  }

  if (typeof document.querySelectorAll !== 'function') {
    document.querySelectorAll = querySelectorAll;
  }

  document.querySelectorAllShim = querySelectorAll;

  function querySelector(selector) {
    return querySelectorAll(selector)[0];
  }

  if (typeof document.querySelectorAll !== 'function') {
    document.querySelectorAll = querySelectorAll;
  }

  document.querySelectorShim = querySelector;

  var selectors = ['div', '#content', '.inner', '.nonexistent'];

  selectors.forEach(function (selector) {
    console.group('Elements matching selector:', selector);
    console.log('querySelectorAll:', document.querySelectorAllShim(selector));
    console.log('querySelector:', document.querySelectorShim(selector));
    console.groupEnd();
  });

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }
})();
