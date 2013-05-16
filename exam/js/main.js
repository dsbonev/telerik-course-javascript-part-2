
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


//Task 3
//click album title to collapse/expand it


//Task 4
var imageGalleryData = {
  "images": [
    {"title":"ninja","url":"images/ninja.png"},
    {"title":"ninja <strong>2</strong>","url":"images/logo.png"}
  ],
  "albums": [
    {
      "title":"an album",
      "images":[],
      "albums":[]
    },
    {
      "title":"js ninjas",
      "images":[
        {"title":"ninja","url":"images/ninja.png"}
      ],
      "albums":[
        {
          "title":"kid ninjas",
          "images":[],
          "albums":[]
        }
      ]
    }
  ]
};
imageGalleryRepository.save('test-storage', imageGalleryData);
console.log(imageGalleryRepository.load('test-storage'));


//Task 5
var ninjaGallery = gallery;
var ninjaGalleryData = ninjaGallery.getImageGalleryData();
imageGalleryRepository.save('ninja-gallery', ninjaGalleryData);


//Task 6
var repositoryData = imageGalleryRepository.load('ninja-gallery');
controls.buildImageGallery('#component_built_from_data_wrapper', repositoryData);


//Task 7
//click an image to zoom it
