
(function (controls, selector) {
  'use strict';

  var accordion = controls.getAccordion(selector);

  accordion.add('Web');
  accordion.add('Desktop');
  accordion.add('Mobile');
  accordion.add('Embedded');

  accordion.render();
})(window.Component, '#component_wrapper');
