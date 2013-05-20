
window.controls = (function () {
  'use strict';

  var extend = (function () {
    function Proxy() {}

    return function (Child, Parent, childPrototypeProps) {
      Proxy.prototype = Parent.prototype;
      Child.prototype = new Proxy();
      Child.prototype.constructor = Child;

      childPrototypeProps = childPrototypeProps || {};

      for (var prop in childPrototypeProps) {
        if (childPrototypeProps.hasOwnProperty(prop)) {
          Child.prototype[prop] = childPrototypeProps[prop];
        }
      }
    };
  })();

  function mixin(recievingObj /*, propertyList1, propertyList2, ...*/) {

    for (var i = 1, length = arguments.length; i < length; i += 1) {
      var propertyList = arguments[i];

      for (var p in propertyList) {
        if (propertyList.hasOwnProperty(p)) {
          recievingObj[p] = propertyList[p];
        }
      }
    }

    return recievingObj;
  }

  function Base() {
    this.boundingElement(null)
      .element(null)
      .items([]);
  }

  extend(Base, Object, {
    add: function (item) {
      this.items().push(item);
      this.childrenContainerElement().appendChild(item.element());
      return item;
    },
    boundingElement: function (/* element */) {
      if (arguments.length > 0) {
        this._boundingElement = arguments[0];
        return this;

      } else {
        return this._boundingElement;

      }
    },
    childrenContainerElement: function (/* element */) {
      if (arguments.length > 0) {
        this._childrenContainerElement = arguments[0];
        if (this._childrenContainerElement) {
          this._childrenContainerElement.classList.add('children');
        }
        return this;

      } else {
        return this._childrenContainerElement;

      }
    },
    element: function (/* element */) {
      if (arguments.length > 0) {
        this._element = arguments[0];
        if (this._element) {
          this._element.classList.add(this.constructor.name.toLowerCase());
        }
        return this;

      } else {
        return this._element;

      }
    },
    items: function (/* list */) {
      if (arguments.length > 0) {
        this._items = arguments[0];
        return this;

      } else {
        return this._items;

      }
    }
  });

  function ImageList(boundingElement) {
    Base.apply(this, arguments);

    this.boundingElement(boundingElement)
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'));

    this.element().appendChild(this.childrenContainerElement());
    this.boundingElement().appendChild(this.element());
  }

  extend(ImageList, Base, {
    serialize: function () {
      var result = [];

      this.items().forEach(function (item) {
        result.push(item.serialize());
      });

      return result;
    }
  });

  function AlbumList(boundingElement) {
    Base.apply(this, arguments);

    this.boundingElement(boundingElement)
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'));

    var sortEl = document.createElement('div');
    sortEl.textContent = 'Sort Albums';
    sortEl.classList.add('sort');
    this.element().appendChild(sortEl);
    this.element().appendChild(this.childrenContainerElement());

    this.boundingElement().appendChild(this.element());
  }

  extend(AlbumList, Base, {
    serialize: function () {
      var result = [];

      this.items().forEach(function (item) {
        result.push(item.serialize());
      });

      return result;
    }
  });

  //sort albums on click
  document.addEventListener('click', function (event) {
    var target = event.target;

    if (target.classList.contains('sort')) {
      var albumListEl = target.nextElementSibling;

      var albumElements = toArray(albumListEl.children);

      albumElements.sort(function (current, next) {
        var currentTitle = current.firstElementChild.textContent.trim(),
          nextElementTitle = next.firstElementChild.textContent.trim();

        if ( currentTitle < nextElementTitle )
          return -1;
        if ( currentTitle > nextElementTitle )
          return 1;
        return 0;
      });

      albumElements.forEach(function (el) {
        albumListEl.appendChild(el);
      });

    }
  });

  function ImageGallery(selector) {
    Base.apply(this, arguments);

    this.boundingElement(document.querySelector(selector))
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'));

    this.element().appendChild(this.childrenContainerElement());
    this.boundingElement().appendChild(this.element());
  }

  extend(ImageGallery, Base, {
    getImageGalleryData: function () {
      return {
        images: this.imageList().serialize(),
        albums: this.albumList().serialize()
      };
    }
  });

  var HasItemLists = {
    addImage: function (title, url) {
      var item = new Image(title, url);
      this.imageList().add(item);

      return item;
    },
    imageList: function (/* list */) {
      if (arguments.length > 0) {
        this._imageList = arguments[0];
        return this;

      } else {
        this._imageList = this._imageList || new ImageList(this.childrenContainerElement());
        return this._imageList;

      }
    },
    addAlbum: function (title, url) {
      var item = new Album(title, url);
      this.albumList().add(item);

      return item;
    },
    albumList: function (/* list */) {
      if (arguments.length > 0) {
        this._albumList = arguments[0];
        return this;

      } else {
        this._albumList = this._albumList || new AlbumList(this.childrenContainerElement());
        return this._albumList;

      }
    }
  };

  mixin(ImageGallery.prototype, HasItemLists);

  function Item(title) {
    Base.apply(this, arguments);

    if (!title) {
      throw new Error('title is required');
    }

    this.title(title)
      .element(document.createElement('div'));

    var titleEl = document.createElement('h6');
    titleEl.classList.add('title');
    titleEl.textContent = this.title();
    this.element().appendChild(titleEl);
  }

  extend(Item, Base, {
    title: function (/* text */) {
      if (arguments.length > 0) {
        this._title = arguments[0];
        return this;

      } else {
        return this._title;

      }
    }
  });

  function Album(title) {
    Item.apply(this, arguments);

    this.childrenContainerElement(document.createElement('div'));

    this.element().appendChild(this.childrenContainerElement());
  }

  extend(Album, Item, {
    serialize: function () {
      return {
        title: this.title(),
        images: this.imageList().serialize(),
        albums: this.albumList().serialize()
      };
    }
  });

  mixin(Album.prototype, HasItemLists);

  Album.parse = function (data) {
    var album = new Album(data.title);

    data.images.forEach(function (itemData) {
      album.imageList().add(Image.parse(itemData));
    });

    data.albums.forEach(function (itemData) {
      album.albumList().add(Album.parse(itemData));
    });

    return album;
  };

  //album title click changes visible state
  document.addEventListener('click', function (event) {
    var target = event.target;

    if (target.classList.contains('title')) {
      var parentElement = target.parentNode;

      if (parentElement &&
          parentElement.classList &&
          parentElement.classList.contains('album')) {

        var collapsibleItems = toArray(parentElement.querySelectorAll('.album'));
        var isCollapsed = parentElement.classList.toggle('collapsed');

        if (isCollapsed) {
          collapsibleItems.forEach(function (item) {
            item.classList.add('collapsed');
          });

        } else {
          collapsibleItems.forEach(function (item) {
            item.classList.remove('collapsed');
          });

        }
      }
    }
  }, false);

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }


  function Image(title, url) {
    Item.apply(this, arguments);

    this.url(url);

    var imgEl = document.createElement('img');
    imgEl.src = this.url();
    this.element().appendChild(imgEl);
  }

  extend(Image, Item, {
    url: function (/* text */) {
      if (arguments.length > 0) {
        this._url = arguments[0];
        return this;

      } else {
        return this._url;

      }
    },
    serialize: function () {
      return {
        title: this.title(),
        url: this.url()
      };
    }
  });

  Image.parse = function (data) {
    return new Image(data.title, data.url);
  };

  //zoom image on click
  var previewEl = document.querySelector('#preview');

  previewEl.addEventListener('click', function (event) {
    event.currentTarget.classList.remove('active');
  }, false);

  document.addEventListener('click', function (event) {
    var target = event.target;

    if (target.tagName.toLowerCase() === 'img') {
      var parentElement = target.parentNode;

      if (parentElement &&
          parentElement.classList &&
          parentElement.classList.contains('image')) {

        var imgEl = target.cloneNode();
        imgEl.style.width = parseInt(target.naturalWidth) * 2 + 'px';
        imgEl.style.height = parseInt(target.naturalHeight) * 2 + 'px';

        previewEl.innerHTML = '';
        previewEl.appendChild(imgEl);
        previewEl.classList.add('active');
      }
    }
  }, false);

  return {
    buildImageGallery: function (selector, data) {
      var gallery = new ImageGallery(selector);

      data = data || {};

      data.images.forEach(function (itemData) {
        gallery.imageList().add(Image.parse(itemData));
      });

      data.albums.forEach(function (itemData) {
        gallery.albumList().add(Album.parse(itemData));
      });

      return gallery;
    },
    getImageGallery: function (selector) {
      return new ImageGallery(selector);
    }
  };
})();



window.imageGalleryRepository = (function () {
  'use strict';



  return {
    load: function (key) {
      return localStorage.getObject(key);
    },
    save: function (key, value) {
      localStorage.setObject(key, value);
    }
  };
})();


