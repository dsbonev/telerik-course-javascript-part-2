
(function (controls, selector) {
  'use strict';

  //Task 1
  var gallery = controls.getImageGallery(selector);

  gallery.addImage('ninja', '../images/ninja.png');
  gallery.addAlbum('js ninjas');
})(window.Component, '#component_wrapper');
