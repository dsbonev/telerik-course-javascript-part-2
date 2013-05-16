
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

  extend(ImageList, Base);

  function AlbumList(boundingElement) {
    Base.apply(this, arguments);

    this.boundingElement(boundingElement)
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'));

    this.element().appendChild(this.childrenContainerElement());
    this.boundingElement().appendChild(this.element());
  }

  extend(AlbumList, Base);

  function ImageGallery(selector) {
    Base.apply(this, arguments);

    this.boundingElement(document.querySelector(selector))
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'))
      .imageList(new ImageList(this.childrenContainerElement()))
      .albumList(new AlbumList(this.childrenContainerElement()));

    this.element().appendChild(this.childrenContainerElement());
    this.boundingElement().appendChild(this.element());
  }

  extend(ImageGallery, Base, {
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
        return this._albumList;

      }
    },
  });

  function Item(title) {
    Base.apply(this, arguments);

    if (!title) {
      throw new Error('title is required');
    }

    this.title(title)
      .childrenContainerElement(document.createElement('div'));
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

    this.element(document.createElement('div'))
      .title(title)
      .childrenContainerElement(document.createElement('div'));

    var titleEl = document.createElement('h6');
    titleEl.classList.add('title');
    titleEl.textContent = this.title();
    this.element().appendChild(titleEl);
  }

  extend(Album, Item);

  function Image(title, url) {
    Item.apply(this, arguments);

    this.element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'));

    var imgEl = document.createElement('img');
    imgEl.src = url;
    this.element().appendChild(imgEl);
  }

  extend(Image, Item);

  return {
    getImageGallery: function (selector) {
      return new ImageGallery(selector);
    }
  };
})();
