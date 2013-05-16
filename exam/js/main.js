
/* globals controls, imageGalleryRepository */

//Task 1
var gallery = controls.getImageGallery('#component_wrapper');

gallery.addImage('ninja', 'images/ninja.png');
gallery.addAlbum('an album');
gallery.addImage('ninja <strong>2</strong>', 'images/logo.png');


//Task 2
var ninjaAlbum = gallery.addAlbum('js ninjas');
ninjaAlbum.addImage('ninja', 'images/ninja.png');

var kidNinjas = ninjaAlbum.addAlbum('kid ninjas');
kidNinjas.addImage('ninja', 'images/ninja.png');
kidNinjas.addImage('ninja <strong>2</strong>', 'images/logo.png');

ninjaAlbum.addImage('ninja <strong>2</strong>', 'images/logo.png');


//Task 4
var imageGalleryData = [];
imageGalleryRepository.save('test-storage', imageGalleryData);
console.log(imageGalleryRepository.load('test-storage'));
