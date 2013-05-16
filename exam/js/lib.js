
window.Component = (function () {
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
      .items([])
  }

  extend(Base, Object, {
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
        return this;

      } else {
        return this._childrenContainerElement;

      }
    },
    element: function (/* element */) {
      if (arguments.length > 0) {
        this._element = arguments[0];
        if (this._element) {
          this._element.classList.add(this.constructor.name);
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

  function ImageGallery(selector) {
    Base.apply(this, arguments);

    this.boundingElement(document.querySelector(selector))
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'))
      .images([])
      .albums([]);

    this.element().appendChild(this.childrenContainerElement());
    this.boundingElement().appendChild(this.element());
  }

  extend(ImageGallery, Base, {
    addImage: function (title, url) {
      var item = new Image(title, url);
      this.images().push(item);
      this.childrenContainerElement().appendChild(item.element());

      return item;
    },
    images: function (/* list */) {
      if (arguments.length > 0) {
        this._images = arguments[0];
        return this;

      } else {
        return this._images;

      }
    },
    addAlbum: function (title) {
      return new Album(title);
    },
    albums: function (/* list */) {
      if (arguments.length > 0) {
        this._albums = arguments[0];
        return this;

      } else {
        return this._albums;

      }
    }
  });

  function Item(title) {
    Base.apply(this, arguments);

    this.title(title)
      .childrenContainerElement(document.createElement('ul'));
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

    this.element(document.createElement('li'))
      .title(title)
      .childrenContainerElement(document.createElement('div'));
  }

  extend(Album, Item);

  function Image(title, url) {
    Item.apply(this, arguments);

    this.element(document.createElement('div'))
      .childrenContainerElement(document.createElement('div'));

    var titleEl = document.createElement('div');
    titleEl.textContent = this.title();
    this.element().appendChild(titleEl);

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
