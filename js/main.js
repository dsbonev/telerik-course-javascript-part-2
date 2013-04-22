
(function () {
  'use strict';

  var previewEl = document.querySelector('#solution-preview');

  document.querySelector('#solutions').addEventListener('click', function (event) {
    event.preventDefault();

    var target = event.target,
      parentBaseUrlElement = target;

    if (target.tagName.toLowerCase() !== 'a') {
      return;
    }

    while (true) {
      parentBaseUrlElement = parentBaseUrlElement.parentElement;

      if (parentBaseUrlElement === null || parentBaseUrlElement.hasAttribute('data-base-url')) {
        break;
      }
    }

    if (parentBaseUrlElement === null) {
      return;
    }

    var baseUrl = parentBaseUrlElement.getAttribute('data-base-url');

    previewEl.src = [baseUrl, target.getAttribute('href'), 'index.html'].join('/');

    window.location.hash = target.getAttribute('id');
  }, false);
})();
